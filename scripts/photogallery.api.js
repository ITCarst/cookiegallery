/*
Name: Cookie Photo Gallery 
Theme default: horizontal
Author: Ionut Carst
Version: 0.1
================ Description =====================================
Javascript Cookie Based Photo Gallery
Adding photos to given image gallery gets read by PHP and saved into Cookies
Once the cookies are set builds the list with all elements in it

================ Action ==========================================
Pause | Delete | Reset | Next | Prev | Play
*/

//append main obj to window obj
if (!window._CG) {
    window._CG = {};
}
//window load show preloader
window.onload = function () {
	_CG.init = new init();
};
_CG = {
	preload : true,
	autoplay : {
        buttons : {
            play : {
                txt : 'Play',
                enabled : true
            },
            pause : {
                txt : 'Pause',
                enabled : true
            },
			remove : {
                txt : 'Remove',
                enabled : true
            },
			reset : {
				txt : 'Reset',
                enabled : true
			},
			save: {
				txt : 'Save',
				enabled : true
			}
        },
		enabled : true, //auto play its enabled
		fadeduration : 2, //fade in and fade out of the images change
		autorotate :  5000
    },
	_settings: {
		placeTarget : 'CGallery', //main target wichi is required in the html
		imagesdir : 'gallery-images/', //folder of the big images -- 
		thumbdir : 'gallery-images/thumbs/', //name and path of the thumbs folder
		readFiles : 'readfiles.php', //php file wich opens|reads the files from folders
		expireTime : 365, //xpire cookie in days --> default 1 year //if days are not added will expire on browser closing
		setCookieName : 'CookieGallery', //define the name of the cookie that will hold the imgs
		readFileType : { //setting for enableing either php reading file or JS reading dir through ajax
			rFServer : true, 
			rFClient : false //this option will make 2 ajax requests one for images dir and one for thumbs
		},
		fileTypes : /(.jpg)|(.gif)|(.png)|(.bmp)$/g,
		splitArray : /<li>|<a .*?>|<\/a>|<\/li>/ig //regex for removing unsed tags that are received from xml call through localhost ajax
	},
	displayType : {
		horizontal : true,
		vertical : false
	},
	isActive : 0,
	images : {},
	thumbs : {
        width : 114,
        height : 72
    },
	loaderGif : 'img/loader.gif' //image loader before everything it's loaded
};

var CGSettings = _CG._settings,
	checkRequest = false,
	doneLoading = false,
	numResourcesLoaded = 0;

//image/cookie/requests preloader
var init = function () {
	if (CGSettings.placeTarget != '') {
		var mainHolder = document.getElementById(CGSettings.placeTarget);
		//check if gallery-module exisits
		if (mainHolder) {
			if (_CG.displayType.vertical == true) {
				mainHolder.className = 'vertical';
			}else{
				mainHolder.className = 'horizontal';
			}
			var preloadMsg = document.createElement('div'),
			requestImages = '',
			requestThumbs = '';

			//build the preloader
			preloadMsg.setAttribute('id', 'preloadMsg');
			preloadMsg.innerHTML = '<img src="' + _CG.loaderGif + '" border="0">';
			mainHolder.appendChild(preloadMsg);

			//request images from the img folder
			if (CGSettings.imagesdir && CGSettings.thumbdir) {
				//check if its server side request
				if (CGSettings.readFileType.rFServer === true) {
					//check if cookies are set so it doesn't make an extra request
					if (document.cookie.length > 0 || document.cookie != '') {
						var results = document.cookie.match(CGSettings.setCookieName + '=(.*?)(;|$)');
						//if the cookies dosen't match then do an other request witch will get our images
						if (results) {
							preLoader();
						}else{
							httpRequest( requestImages, CGSettings.imagesdir, CGSettings.fileTypes, CGSettings.splitArray, function () {
								if(checkRequest === true) {
								preLoader();
								}
							});	
						};
					}else{
						httpRequest( requestImages, CGSettings.imagesdir, CGSettings.fileTypes, CGSettings.splitArray, function () {
							if (checkRequest === true) {
								preLoader();
							}
						});						
					};
				}else if (CGSettings.readFileType.rFClient === true) {
					httpRequest(requestImages, CGSettings.imagesdir, CGSettings.fileTypes, CGSettings.splitArray);
					httpRequest(requestImages, CGSettings.thumbdir, CGSettings.fileTypes, CGSettings.splitArray);
				};
			}	
		}else{
			createErrorNotif('Your defined id doesn\'t match the api id');
		}
	}else{
		createErrorNotif('You must define an id for the gallery placeholder');
	}
}
//private fn for building the preloader and reads the cookies
function praseFiles (images) {
	var cGet = _CG.cookie.get(CGSettings.setCookieName);
	var preloadMsg = document.getElementById('preloadMsg');

	if (cGet == null) {
		createErrorNotif('You must enable cookies for the gallery to work');
		preloadMsg.style.display = 'none';
		return false;
	}
	if (cGet != '') {
		if (setImages(cGet)) {
			doneLoading = true;
			return true;
		};
	}else{
		var c = _CG.cookie.get(CGSettings.setCookieName);
		if (c) {
			if (setImages(c)) {
				doneLoading = true;
				return true;
			};
		};
	};
	function setImages (c) {
		//Reads the cookie and strips the thumbs and other aditions
		//adds the path to the images + image name and saves it into an image obj and an image array
		//do the loader
		var getCActive = _CG.cookie.getCActive(); //get the number of active from cookie
		var cLength = c.length;

		for (var i = 0; i < cLength; i++) {
			//remove the thumb_ from cookie name that it's set into php|JS
			var matchT = c[i].match(/thumb_/),
				matchA = c[i].match('active_' + getCActive),
				replaceA = c[i].replace(matchA, ''),
				replaceT = c[i].replace(matchT, ''),
				stringImg = [];

			if (matchT) {
				stringImg += (CGSettings.thumbdir + replaceT);
			}else if (matchA) {
				stringImg += replaceA;
			}else{
				stringImg += (CGSettings.imagesdir + replaceT);
			};
			if (stringImg != '') {
				images[stringImg] = new Image();
				images[stringImg].onload = function() {
					//check if images status
					if(this.complete === true) {
						//add +1 to counter
						numResourcesLoaded += 1;
						if((cLength - 1) === numResourcesLoaded) {
							//if counter it's = with all images then hide loading msg
							preloadMsg.style.display = 'none';
						};
					};
				};
				//add source to img
				images[stringImg].src = stringImg;
			}else{
				preloadMsg.style.display = 'none';
			}
		}
		if (_CG.images) {
			//if the user delets all the images from cookies display message
			var savedImgs = _CG.images;
			var checkEntries = false;
			//check if images obj has no values if not show message and return false for stop building the list
			for (var key in savedImgs) {
				if (savedImgs.hasOwnProperty(key)) {
					checkEntries = true;
				}
			}
			if (checkEntries == true) {
				return true;
			}else{
				createErrorNotif('You have deleted all the images from cookies');
				return false;
			}
		};
	};
};
function preLoader() {
	var doneParse = praseFiles(_CG.images);
	if (doneParse) {
		_CG.buildList();
	};
};

//general fn for makeing the ajax request in the folders
function httpRequest(xhr, path, filetype, splitArr, callback) {
	var _xhr = xhr,
		retrunImageFiles = [],
		returnImageThumb = [],
		count = 0,
		total = 0,
		sendUrl = CGSettings.readFiles + '?path=' + path, //url for read file server side
		preloadMsg = document.getElementById('preloadMsg');
	
	if (window.XMLHttpRequest) {
		_xhr = new XMLHttpRequest();
	}else if (window.ActiveXObject) {
		try{
			_xhr = ActiveXObject("Msxml2.XMLHTTP.6.0");
		}catch (e) {
			try {
				_xhr = ActiveXObject("Msxml2.XMLHTTP.3.0");
			}catch (e) {
				try {
					_xhr = ActiveXObject("Microsoft.XMLHTTP");
				}catch (e) {
					createErrorNotif("This browser does not support XMLHttpRequest." + e);
				};
			};
		};
	};
	if (_xhr) {
		_xhr.onreadystatechange = function() {
			if (_xhr.readyState == 4) {
				if (_xhr.status == 200) {
					var responeTxt = _xhr.responseText,
						matchExtension = responeTxt.match(filetype);
					//check for images extenstions and if the response it's bigger then 0	
					if (matchExtension && responeTxt.length > 0 && responeTxt.length != '') {
						if (CGSettings.readFileType.rFServer === true) {
							/* ---------------------------------
							* PHP JSON RESPONSE
							* --------------------------------- */
							var parseResponse = JSON.parse(responeTxt);

							for (var x = 0; x < parseResponse.length; x++) {
								//check matches for extension from the json
								if (parseResponse[x].match(filetype)) {
									//push images into the empty array
									retrunImageFiles.push(parseResponse[x]);
								};
							};
							if (retrunImageFiles != '') {
								callback(_CG.cookie.checkCookies(retrunImageFiles, false, _CG.cookie.getCActive()));
							};
						}else if (CGSettings.readFileType.rFClient === true) {
							/* -------------------------------
							* LOCAL HOST REQUEST AND PARSE
							*  ------------------------------ */ 
							//remove the a tag so it wont get duplicated entries
							var splitArray = responeTxt.split(splitArr);
							total = splitArray.length;
							//loop through the array and get the founded files from dir
							for (var x = 0; x < splitArray.length; x++) {
								count++;
								//check matches for extension from the array
								if (splitArray[x].match(filetype)) {
									//check for path and if it's thumb then add thumb to the small images
									if (path === CGSettings.imagesdir) {
										retrunImageFiles += splitArray[x];
									};
									if (path === CGSettings.thumbdir) {
										returnImageThumb += 'thumb_' + splitArray[x];
									};
								};
							};
							if (count == total) {
								_CG.cookie.checkCookies(retrunImageFiles, returnImageThumb, _CG.cookie.getCActive());
							};
						}else{
							if (preloadMsg) {
								preloadMsg.style.display = 'none';
							}
							createErrorNotif('Please make sure you have enabled one reading file option');
						};
					}else{
						if (preloadMsg) {
							preloadMsg.style.display = 'none';
						}
						createErrorNotif(responeTxt);
					};
				}else{
					if (preloadMsg) {
						preloadMsg.style.display = 'none';
					}
					createErrorNotif("Error Code:" + _xhr.status + ' Error Type:' + _xhr.statusText);
				};
			};
		};
		if (CGSettings.readFileType.rFServer === true) {
			//php get requst
			_xhr.open("GET", sendUrl, true);
		}else if (CGSettings.readFileType.rFClient === true) {
			//localhost request returing 
			_xhr.open("GET", path, true);
		};
		_xhr.send(null);
	};
};

_CG.cookie = new cookie();
function cookie() {
	var _cookie = this,
		cookieName = CGSettings.setCookieName,
		c_start = document.cookie.indexOf(cookieName + "="),
		c_end = document.cookie.indexOf(";" , c_start);

	//set cookies name|value|time
	this.set = function (name, value, time, active) {
		//add to cookie the images value + the saved image
		value = value + ',active_' + active;
		_cookie.setCVal(name, value, time)
		checkRequest = true;		
	};
	//get cookies 
	this.get = function (check_name) {
		// first we'll split this cookie up into name/value pairs
		// note: document.cookie only returns name=value, not the other components
		var a_all_cookies = document.cookie.split(';'),
			a_temp_cookie = '',
			cookie_name = '',
			cookie_value = '',
			b_cookie_found = false; // set boolean t/f default f
		for (i = 0; i < a_all_cookies.length; i++) {
			// now we'll split apart each name=value pair
			a_temp_cookie = a_all_cookies[i].split('=');
			// and trim left/right whitespace while we're at it
			cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
			// if the extracted name matches passed check_name
			if (cookie_name == check_name) {
				b_cookie_found = true;
				// we need to handle case where cookie has no value but exists (no = sign, that is):
				if (a_temp_cookie.length > 1) {
					cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
					cookie_value = cookie_value.split(/,/);
				};
				// note that in cases where cookie is initialized but no value, null is returned
				return cookie_value;
				break;
			};
			a_temp_cookie = null;
			cookie_name = '';
		};
		if (!b_cookie_found) {
			return null;
		};	
	};
	/*
		if JS reading it's set build the second cookie for the thumbs
		check if the cookies are set receive and if the thumbs cookie its not set set thumb cookie
	*/
	this.checkCookies = function (returnImg, returnThumb, active) {
		//if the thumbs img is false that means we have a php request to files
		if (returnThumb != false) { //JS CALL
			var cName = 'CookieGalleryThumbs';
			_cookie.setCVal(cName, returnThumb, _CG._settings.expireTime, active);
			_cookie.checkCGal(returnThumb, cName, active);
		}else{
			//if its php request do the checking for cookie and set it
			_cookie.checkCGal(returnImg, cookieName, active);
		};
	};
	/*
		check the cookies are set
		if the cookie its already set make sure it's the cookie gallery
		if there are cookies but not the cookie gallery then set it
	*/ 
	this.checkCGal = function (_returnImgs, cName, active) {
		if (_returnImgs != '') {
			//if there are no cookies then set our cookie
			if (document.cookie === '' || document.cookie.length <= 0) {
				//set the cookies if there are not there
				_cookie.set(cName, _returnImgs, _CG._settings.expireTime, active);
			}else{
				//get the start and end of your cookie appling expecialy of server has multiple cookies
				_cookie.getCIndexes(c_start, c_end, _returnImgs, active);
			};			
		};
	};
	//get the start and end of your cookie precaution if the server has already multiple cookies
	this.getCIndexes = function (startVal, endVal, receivedImg, active) {
		//check if in cookies we find is the cookie gallery
		if (startVal != -1) {
			startVal = startVal + cookieName.length + 1;
			if (endVal == -1) {
				endVal = document.cookie.length;
			};
			return unescape(document.cookie.substring(startVal, endVal));
		}else{
			_cookie.set(cookieName, receivedImg, _CG._settings.expireTime, active);
		};
	};
	this.setCVal = function (name, value, time) {
		if (time) {
			var date = new Date();
			date.setTime(date.getTime()+(time * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}else{
			var expires = "";
		};
		document.cookie = name + "= " + value + expires + "; path=/";		
	};
	//get the active number from the cookie
	this.getCActive = function () {
		var getC = _cookie.get(CGSettings.setCookieName),
			repalceA;
		if (!getC) {
			repalceA = _CG.isActive;
		}else{
			for (var i=0; i < getC.length; i++) {
				var matchA = getC[i].match('active_');
				if (matchA) { 
					repalceA = getC[i].replace(matchA, '');
				}else{
					repalceA = _CG.isActive;
				};
			};
		};
		return Number(repalceA);
	};
};

//main object that creates the HTML and images
_CG.buildList = function () {
	var mainHolder = document.getElementById(CGSettings.placeTarget),
		cookieGet = _CG.cookie.get(CGSettings.setCookieName),
		getCActive = _CG.cookie.getCActive(), //get the number of active from cookie
		thumbs = [],
		bigImgs = [],
		mObjs = [],
		speed = 300,
		countImage,
		noThumbsInView = 0,
		doReset = false,
		getNew = 0,
		listH;
		
	//calls the merged objects togheter
	//builds the HTML list
	//init the thumbs and imgs
	initList = function () {
		//split _thumbs cookie from big img cokoie
		splitCookies();
		//create all html holders
		createDomElements();
		//merge the thumbs object with the big image obj
		mergeObjs();

		listH = document.getElementById('listH');
		if (listH) {
			storeThumbsInView();
			//add dynamic width to the ul
			storeUlWidth(listH);
			//create the li with img and append them to ul
			setThumbs(listH);
			//if the autoplay is true do autorotate
			if (_CG.autoplay.enabled) {
				startAutoPlay(listH, _CG.autoplay.autorotate);
			};
		};
	};
	//loops through cookie and splits the thumbs from big images
	//builds 2 arrays with new values
	var splitCookies = function () {
		/* loop through images that are saved into the cookies
		separate the thumbs from big images
		build object with id, index src etc for each img for further linking
		*/
		var matchUrl = /thumb_/i;
		for (var i = 0; i < cookieGet.length; i++) {
			//separate thumbs
			if (cookieGet[i].match(matchUrl)) {
				var stripname = cookieGet[i].replace(matchUrl, '');
				thumbs.push(CGSettings.thumbdir + stripname);
			}else{
				bigImgs.push(CGSettings.imagesdir + cookieGet[i])			
			};
		};
	};
	//Holds only the HTML elements without actually images or thumbs
	var createDomElements = function () {
		createBigHolder();
		creatContorls();
		createThumbHolder();
		clickActions();
	};
	//create the top part of the gal big image and controls
	var createBigHolder = function () {
		var imgHolder = document.createElement('div'),
			gControl = document.createElement('div'),
			cHolders = document.createElement('div'),
			imgIn = document.createElement('div');
			
		//check if the _CG has enabled the buttons
		//if there are true create html elements with specific ID's for each action buttons
		if (_CG.autoplay.buttons.play.enabled == true) {
			var start = document.createElement('div');
			start.setAttribute('id', 'play');
			start.setAttribute('class', 'actionControls');
			start.title = _CG.autoplay.buttons.play.txt;
			cHolders.appendChild(start);
		};
		if (_CG.autoplay.buttons.pause.enabled == true) {
			var stop = document.createElement('div')
			stop.setAttribute('id', 'stop');
			stop.setAttribute('class', 'actionControls');
			stop.title = _CG.autoplay.buttons.pause.txt;
			cHolders.appendChild(stop);
		};
		if (_CG.autoplay.buttons.remove.enabled == true) {
			var remove = document.createElement('div');
			remove.setAttribute('id', 'remove');
			remove.setAttribute('class', 'actionControls');
			remove.title =  _CG.autoplay.buttons.remove.txt;
			cHolders.appendChild(remove);
		};
		if (_CG.autoplay.buttons.save.enabled == true) {
			var save = document.createElement('div');
			save.setAttribute('id', 'save');
			save.setAttribute('class', 'actionControls');
			save.title = _CG.autoplay.buttons.save.txt;
			cHolders.appendChild(save);
		};
		if (_CG.autoplay.buttons.reset.enabled == true) {
			var reset = document.createElement('div');
			reset.setAttribute('id', 'reset');
			reset.setAttribute('class', 'actionControls');
			reset.title = _CG.autoplay.buttons.reset.txt;
			cHolders.appendChild(reset);
		};
		imgHolder.setAttribute('id', 'imgHolder');
		imgIn.setAttribute('id', 'imgIn');
		gControl.setAttribute('id', 'controls');
		cHolders.setAttribute('id', 'contorlHolders');

		mainHolder.appendChild(imgHolder);
		imgHolder.appendChild(imgIn);
		imgHolder.appendChild(gControl);
		gControl.appendChild(cHolders);
	};
	//create controls next prev and caption
	var creatContorls = function () {
		var infoH = document.createElement('div'),
			prev = document.createElement('div'),
			photoCaption = document.createElement('div'),
			next = document.createElement('div');
		
		infoH.setAttribute('id', 'infoH');
		prev.setAttribute('id','prev');
		next.setAttribute('id','next');
		prev.setAttribute('class', 'moveControls');
		next.setAttribute('class', 'moveControls');
		photoCaption.setAttribute('id','photoCaption');
		mainHolder.appendChild(infoH);
		infoH.appendChild(prev);
		infoH.appendChild(next);
		infoH.appendChild(photoCaption);
		
	};
	//create holder of the thumbs
	var createThumbHolder = function () {
		var thumbH = document.createElement('div'),
			ulList = document.createElement('ul');
			
		thumbH.setAttribute('id','thumbH');
		ulList.setAttribute('id', 'listH');
		mainHolder.appendChild(thumbH);
		thumbH.appendChild(ulList);
	};
	
	//get all the buttons which has action and apply the click event on them
	//each one calls it's functionality functions
	var clickActions = function () {
		var nextBtn = document.getElementById('next'),
			prevBtn = document.getElementById('prev'),
			stopBtn = document.getElementById('stop'),
			playBtn = document.getElementById('play'),
			removeBtn = document.getElementById('remove'),
			resetBtn = document.getElementById('reset'),
			saveBtn = document.getElementById('save');

		//chcek if action buttons are enabled then apply action functions to them
		if (playBtn) {			
			playBtn.onclick = function () {
				resetAutoPlayOnClick();
			};
		};
		if (stopBtn) {
			stopBtn.onclick = function () { 
				stopAnimation();
			};
		};
		if (removeBtn) {
			removeBtn.onclick = function () {
				removeCurrent();
			};
		};
		if (resetBtn) {
			resetBtn.onclick = function () {
				resetAnimation();
			};
		};
		if (saveBtn) {
			saveBtn.onclick = function () {
				var stringAction = 'Save';
				saveCurrent(stringAction);
			};
		};
		if (nextBtn && prevBtn) {
			//move slider to right
			nextBtn.onclick = function () {
				resetAutoPlayOnClick();
				moveRight();
			};
			//move slider to left
			prevBtn.onclick = function () {
				resetAutoPlayOnClick();
				moveLeft();
			};
		};
	};
	//function to create an object with detailed information
	//returns new object
    var addImageToGallery = function (imageConfig) {
        imageConfig  = {
            index : imageConfig.index,
            id : imageConfig.id,
            thumb : imageConfig.thumb,
            caption : imageConfig.caption,
            src : imageConfig.src
        };
		return imageConfig;
    };
	//once we split the cookie push into new object just the thumbs
	//returns new object
	var setThumbObj = function () {
		var objThumb = [];
		for (var x = 0; x < thumbs.length; x++) {
			objThumb.push(
				addImageToGallery({
					index : x,
					id : x,
					thumb : thumbs[x],
					caption : thumbs[x],
					src : thumbs[x]
				})			
			);	
		};
		return objThumb;
	};
	//once we split the cookie push into new object just the big images
	//returns new object
	var setImgObj = function () { 
		var objImg = [];
		for (var x = 0; x < bigImgs.length; x++) {
			objImg.push(
				addImageToGallery({
					index : x,
					id : x,
					thumb : bigImgs[x],
					caption : bigImgs[x],
					src : bigImgs[x]
				})			
			);		
		};
		return objImg;
	};
	//setThumbObj and setImgObj merged togheter for haveing single id or index for the same thumb and img
	//returns new object
	var mergeObjs = function() {
		var objThumb = setThumbObj(),
			objImgs = setImgObj();
		for (var p in objThumb) {
			for (var o in objImgs) {
				//get the big image name
				mObjs[p] = {
					index : objThumb[p].index,
					id : objThumb[p].id,
					thumb : objThumb[p].thumb,
					caption : objImgs[p].src,
					src : objImgs[p].src
				};
			};
		};
		setCaptionName();
		return mObjs;
	};
	//overwrite the main obj caption with just the names of the big images
	var setCaptionName = function () {
		for (var x= 0; x < mObjs.length; x++) {
			var getCaption = mObjs[x].caption;
			var matchDir = getCaption.match(CGSettings.imagesdir);
			var matchExtension = getCaption.match(CGSettings.fileTypes)
			if (matchDir && matchExtension) {
				var removeDir = getCaption.replace(CGSettings.imagesdir, '');
				var removeExt = removeDir.replace(CGSettings.fileTypes, '');
				mObjs[x].caption = removeExt;
			}
		};
		return mObjs;
	}
	//get the thumb holder width and devided by the thumbs width
	//return the number of the thumbs that can be visible into thumb holder
	var storeThumbsInView = function () {
		var thumbH = document.getElementById('thumbH'),
			containerWidth = thumbH.offsetWidth,
			containerHeight = thumbH.offsetHeight;
			
        if (_CG.displayType.vertical == true) {
			noThumbsInView = Math.round(containerHeight / _CG.thumbs.height);
		}else{
			noThumbsInView = Math.round(containerWidth / _CG.thumbs.width);
		}
	};
	//set width to the ul imgs.length * the thumb width	
	var storeUlWidth = function (ulH) {
		var setW;
		if (_CG.displayType.vertical == true) {
			setW = (ulH.style.height = Math.round(mObjs.length * (_CG.thumbs.width + 4)) + 'px');
		}else{
			setW = (ulH.style.width = Math.round(mObjs.length * (_CG.thumbs.width + 4)) + 'px'); //repesents the CSS style left
		}
		return setW;
	};
	//once the object thubms it's set apply id and value for identifing the images
	var setThumbs = function (ulHolder) {
		var x = 0, max = mObjs.length, id = 0, index = 0,
			imgH = document.getElementById('imgIn'),
			photoCaption = document.getElementById('photoCaption');
		
		for (x; x < max; x++) {
			var liList = document.createElement('li'),
				id = mObjs[x].id,
				index  = mObjs[x].index,
				thumbSrc = mObjs[x].thumb,
				bigSrc = mObjs[x].src,
				matchSrc = thumbSrc.match(CGSettings.thumbdir),
				replaceSrc = thumbSrc.replace(matchSrc, ''), //replace the images path
				matchExt = replaceSrc.match(CGSettings.fileTypes), //match extensions
				rmvExtension = replaceSrc.replace(matchExt, ''); //replace extensions and get only the image name and apply id to the img thumbs
				
			liList.setAttribute('id', 'list_' + id);
			ulHolder.appendChild(liList);
 			
			//create thumb images and append them to each li
			createImgThumb(rmvExtension, liList, thumbSrc);
			
			liList.onclick = function (e) {
				resetAutoPlayOnClick();
				clickOnThumbnail(e);
			};
			if (x == getCActive) {
				if (liList.id == 'list_' + getCActive) {
					liList.setAttribute('class', 'active');
					createBigImg(getCActive, imgH);
					photoCaption.innerHTML = mObjs[id].caption;
					moveHighilightIntoView(getCActive);
				};
			};
		};
	};
	//create thumbs annd apend them
	var createImgThumb = function (id, list, thumbSrc) {
		if (id != null || id != '') {
			var createT = document.createElement('img');
			createT.setAttribute('id','thumb_' + id);
			createT.setAttribute('width', _CG.thumbs.width);
			createT.setAttribute('height', _CG.thumbs.height);
			createT.src = thumbSrc;
			list.appendChild(createT);
		};
	};
	var createBigImg = function (id, holder) {
		if (id != null) {
			var foundId = document.getElementById('img_' + id), createImg;
			//first time the count image is null
			//but when the image is set the countImage gets the image
			if (countImage != null) {
				var getImages = holder.getElementsByTagName('img'), imgeLength = getImages.length, x = 0;
				//loop through holder images and match the id with the found id
				for (x; x < imgeLength; x++) {
					if (countImage.id != id) {
						var setOpacity = getImages[x];
						clearInterval(setOpacity.timer);
						setOpacity.timer = setInterval(function () {
							fdout(setOpacity);
						},_CG.autoplay.fadeduration);
					};
				};
			};
			//if the holder has no image then create the first image	
			if (!foundId) {
				createImg = document.createElement('img');
				createImg.src = mObjs[id].src;
				createImg.id = 'img_' + mObjs[id].id;
				createImg.setOpacity = 0;
				createImg.style.opacity=0;
				createImg.style.filter='alpha(opacity=0)';
				holder.appendChild(createImg);
			}else{
				createImg = document.getElementById('img_' + id);
				clearInterval(createImg.timer);
			};
			createImg.timer = setInterval( function () {
				fdin(createImg);
			}, _CG.autoplay.fadeduration);
		};		
	};
	//fade in the big image
	var fdin = function (image) {
		//check if image has been loaded and set opacity based on the interval increases
		if (image.complete) {
			image.setOpacity = image.setOpacity + _CG.autoplay.fadeduration;
			image.style.opacity = image.setOpacity / 100;
			image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		};
		//once the image visibility reaches 100 then set opacity to 1
		if (image.setOpacity >= 100) {
			image.style.opacity = 1;
			image.style.filter = 'alpha(opacity=100)';
			clearInterval(image.timer);
			countImage = image;
		};
	};
	//fade out the big image
	var fdout = function (image) {
		image.setOpacity = image.setOpacity - _CG.autoplay.fadeduration;
		image.style.opacity = image.setOpacity / 100;
		image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		
		if (image.setOpacity <= 0) {
			clearInterval(image.timer);
			if (image.parentNode) {
				image.parentNode.removeChild(image);
			};
		};
	};	
	//general function witch gets the all objects but returns just the object with the machted id
    var getImageDataById = function (id) {
        for (var i = 0; i < mObjs.length; i++) {
            if (mObjs[i].id == id) {
                return mObjs[i];
            };
        };
    };
	//on thumbnail click get target id and replace the string convert it into number
	//then send the given id to the selectImage fn
	var clickOnThumbnail = function (e) {
		var target = e ? e.target : window.event.srcElement;
		var getTargetId = target.parentNode.id,
			getId = getTargetId.replace('list_', ''),
			id = Number(getId);
		//update the startPos with the new id
		_CG.isActive = id;
		selectImage(id);
    };
	//moves the slider to right
	//if reaches the max length of the images starts from 0
	var moveRight = function (ulList) {
		if (getCActive) {
			_CG.isActive = getCActive++;
		}
		_CG.isActive = _CG.isActive + 1;
		
		if (_CG.isActive >= mObjs.length) {
			getCActive = 0;
            _CG.isActive = 0;
        };
		selectImage(mObjs[_CG.isActive].id);
	};
	//moves slider to left
	//if gets under 0 then start from the end position of the given images object
	var moveLeft = function () {
		var listH = document.getElementById('listH'),
			ulC = listH.children;
		if (getCActive) {
			_CG.isActive = getCActive--;
		}
		_CG.isActive = _CG.isActive - 1;

		if (_CG.isActive < 0) {
			_CG.isActive = mObjs.length - 1;
		};
		selectImage(mObjs[_CG.isActive].id);
	};
	//sects active class to the li
	//and if it already exists then removes the active and gives it to the next li
	var createThumbHighLight = function (id) {
		var imageData = getImageDataById(id);
		for (var x = 0; x < mObjs.length; x++) {
			var getList = document.getElementById('list_' + mObjs[x].id);
			if (mObjs[x].id == id) {
				getList.setAttribute('class', 'active');
			}else{
				if (getList.className == 'active') {
					getList.removeAttribute('class', 'active');
				};
			};
		};
	};
	var isLocatedBeyondRightEdgeOfView = function(currentLi, ulWidth, sendNo) {
		for (var x = 0 ; x < mObjs.length; x++) {
			if (mObjs[x].id == currentLi) {
				var remainingTillEnd = mObjs.length - currentLi;
				if (remainingTillEnd < (noThumbsInView - sendNo)) {
					var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
					newIndexHighlight = ((getLast * _CG.thumbs.width) - (ulWidth - _CG.thumbs.width));
				}
			}
		}		
	};
	var moveHighilightIntoView = function (id) {
		var newIndexHighlight,
			listH = document.getElementById('listH'),
			activeLi = getActiveEl(listH),
			getHWidth = listH.offsetWidth,
			counter = 0;
		
		//start position is 0
		if (activeLi == 0) {
            newIndexHighlight = 0;
        }
		//start from end position
		else if (activeLi == mObjs.length - 1) {
			if (_CG.displayType.vertical == true) {
				newIndexHighlight = 0;
			}else{
				var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
				newIndexHighlight = ((getLast * _CG.thumbs.width) - (getHWidth - _CG.thumbs.width));
			}
        }
		else if (activeLi > noThumbsInView) {
			newIndexHighlight = - (noThumbsInView - 1) * _CG.thumbs.width;
			for (var x = 0 ; x < mObjs.length; x++) {
				if (mObjs[x].id == activeLi) {
					var remainingTillEnd = mObjs.length - activeLi;
					if (remainingTillEnd < noThumbsInView) {
						var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
						newIndexHighlight = ((getLast * _CG.thumbs.width) - (getHWidth - _CG.thumbs.width));
					}
				}
			}
        }
		else if (activeLi >= (noThumbsInView - 1)) {
			var getNew = Math.min(noThumbsInView - 1, activeLi - 1);
			newIndexHighlight = - (getNew * _CG.thumbs.width);
			isLocatedBeyondRightEdgeOfView(activeLi, getHWidth, 1);
        }
		else if (activeLi <= 0) {
            newIndexHighlight = activeLi;
        }
        else {
            newIndexHighlight = 0;
        }			
		listH.style.webkitTransitionDuration = listH.style.MozTransitionDuration = speed + 'ms';
		listH.style.msTransitionDuration = listH.style.OTransitionDuration = speed + 'ms';
		listH.style.transitionDuration = speed + 'ms';

		if (_CG.displayType.vertical == true) {
			listH.style.top = newIndexHighlight + 'px';
		}else{
			listH.style.left = newIndexHighlight + 'px';
		}
	};
	//returns the id of the active li elem
	var getActiveEl = function (listH) {
		var getLi = listH.getElementsByTagName('li'), foundActive;
		for (var x = 0; x < getLi.length; x++) {
			if (getLi[x].className == 'active') {
				foundActive = getLi[x].id.replace('list_', '');
				break;			
			};
		};
		return Number(foundActive);
	};
	//select big image based on the id
	var selectImage = function (id) {
		var holder = document.getElementById('imgIn'),
			imageData = getImageDataById(id),
			photoCaption = document.getElementById('photoCaption');
			
		createBigImg(id, holder);
		createThumbHighLight(id);
		moveHighilightIntoView(id);
		photoCaption.innerHTML = mObjs[id].caption;
	};
	//start auto play of the ul based on the _CG settings duration
	var startAutoPlay = function (ulList, time) {
		if (thumbs != '') {
			ulList.timer = setInterval(function () {
				moveRight();
			}, time);	
		}
	};
	var stopAnimation = function () {
		var listH = document.getElementById('listH');
		clearInterval(listH.timer);
	};
	//when clicking the next or prev stop the interval for auto rotate and reset it again to the _CG settings
	var resetAutoPlayOnClick = function () {
		var listH = document.getElementById('listH');
		clearInterval(listH.timer);
		startAutoPlay(listH, _CG.autoplay.autorotate);
	};
	//reset animation reset _CG active and the cookie value recevied to 0
	//applies on the reset btn of the gallery
	var resetAnimation = function () {
		stopAnimation();
		var stringAction = 'reset';
		doReset = true;
		_CG.isActive = 0;
		getCActive = 0;
		saveCurrent(stringAction)
	};
	//saves the current image into cookie based on the active li
	var saveCurrent = function (stringAction) {
		stopAnimation();
		var listH = document.getElementById('listH'),
			activeLi = getActiveEl(listH),
			imgArr = _CG.cookie.get(CGSettings.setCookieName),//get the number of active from cookie
			getCurrentActive = _CG.cookie.getCActive();
			
		for (var i=0; i < imgArr.length; i++) {
			var matchExact = imgArr[i].match('active_' + getCurrentActive), //match exact entry used on the save btn
				matchAp = imgArr[i].match('active_' + activeLi); //match aproximative active used from reset animation fn
			if (doReset == true) {
				imgArr[i] = imgArr[i].replace(matchAp, 'active_0'); //goes here when the reset button its presed sets the cookie back from 0
			}else if (matchExact) {
				imgArr[i] = imgArr[i].replace(matchExact, 'active_' + activeLi);
			};
		};
		confirmationPopup(stringAction,imgArr);
	};
	//removes the current image from the list and from the cookies
	var removeCurrent = function () {
		stopAnimation();
		var removeString = 'delete',
			listH = document.getElementById('listH'),
			imgIn = document.getElementById('imgIn'),
			activeLi = getActiveEl(listH),
			getCurrentLi = document.getElementById('list_' + activeLi),
			imgArr = _CG.cookie.get(CGSettings.setCookieName),
			getTName = getThumbNames();

		for (var x = 0; x < getTName.length; x++) {
			var currentT = document.getElementById('thumb_' + getTName[x]),
				currentB = mObjs[x].src,
				matchSrc = currentB.match(CGSettings.imagesdir),
				replaceSrc = currentB.replace(matchSrc, ''); //replace extensions and get only the image name and apply id to the img thumbs
			
			if (currentT.parentNode == getCurrentLi) {
				for (var i=0; i < imgArr.length; i++) {
					var test = imgArr[i].match(CGSettings.fileTypes);
					var matchAT = imgArr[i].match(currentT.id + test), //match active thumb
						matchBA = imgArr[i].match(replaceSrc); //match big image active
					if (matchAT) {
						imgArr[i] = imgArr[i].replace(matchAT, ''); //goes here when the reset button its presed sets the cookie back from 0
					}else if (matchBA) {
						imgArr[i] = imgArr[i].replace(matchBA, '');
					};
				};
				break;
			};
		};
		imgArr.clean("");
		confirmationPopup(removeString, imgArr);
		
	};
	//builds the html for the poup confirmation with yes and no btn
	//checks for confirmation fn and returns either false or true based on what the user clicks
	var confirmationPopup = function (action, sendImages) {
		var alertHolder = document.createElement('div'),
			wrapper = document.getElementById(CGSettings.placeTarget);
			
		alertHolder.setAttribute('id', 'alertHolder');
		alertHolder.innerHTML = ('<div class="innerHolder"><div>Are you sure you want to '+ action +'?</div>'+
								 '<div class="btnBig left" id="btnYes">Yes</div><div id="btnNo" class="btnBig right">No</div>'+
								 '<div class="clear"><!-- empty --></div></div>'
								 );
		wrapper.appendChild(alertHolder);
		
		var btnYes = document.getElementById('btnYes'),
			btnNo = document.getElementById('btnNo');
			
		if (btnYes) {
			btnYes.onclick = function () {
				confirmationActions(action);
				_CG.cookie.setCVal(CGSettings.setCookieName, sendImages, _CG._settings.expireTime);
				wrapper.removeChild(alertHolder);
				return true;
			}
			btnNo.onclick = function () {
				wrapper.removeChild(alertHolder);
				return false;
			};		
		};
		
	};
	var confirmationActions = function (action) {
		var listH = document.getElementById('listH'),
			activeLi = getActiveEl(listH),
			getCurrentLi = document.getElementById('list_' + activeLi),
			getCurrentBig = document.getElementById('img_' + activeLi),
			getHWidth = listH.offsetWidth;

		//action delete set new width and move right
		if (action == 'delete') {
			var newWidth = (getHWidth - _CG.thumbs.width) - 5; //5 represents the li margin-left
			listH.style.width = newWidth + 'px';
			getCurrentLi.style.display = 'none';
			getCurrentBig.style.display = 'none';
			moveRight();
		}
		if (action == 'reset') {
			selectImage(_CG.isActive);
			resetAutoPlayOnClick();
		}
		//on click save the new updated cookies
	}
	//get the name of the thumbs and saves it into an array
	var getThumbNames = function () {
		var saveNew = [];
		for (var x = 0; x < mObjs.length; x++) {
			var bigSrc = mObjs[x].thumb,
				matchSrc = bigSrc.match(CGSettings.thumbdir),
				replaceSrc = bigSrc.replace(matchSrc, ''), //replace the images path
				matchExt = replaceSrc.match(CGSettings.fileTypes), //match extensions
				rmvExtension = replaceSrc.replace(matchExt, ''); //replace extensions and get only the image name and apply id to the img thumbs
				
			saveNew.push(rmvExtension)
		};
		return saveNew;
	};
	if (CGSettings.placeTarget != '') {
		if (mainHolder) {
			if (doneLoading === true) {
				initList();
			};
		};
	};	
};
// error notification function which creates an element and placeses the error as a string
function createErrorNotif (string) {
	var errorMsg = document.createElement('div');
	errorMsg.id = 'errorMsg';
	errorMsg.innerHTML = string;
	document.body.appendChild(errorMsg);	
	return errorMsg;
}
//prototype fn which checks the array and removes the given string from an arrary
//used on remove image function
Array.prototype.clean = function (to_delete) {
	var a;
	for (a = 0; a < this.length; a++) {
	  if (this[a] == to_delete) {         
		 this.splice(a, 1);
		 a--;
	  };
   };
   return this;
};
/* TO DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	DONE * to fix the move into highlight logic
	DONE * clean up the confirmation function
	* bug on removeing the current image
	* Refactoring
	DONE * INTERNET EXPLOERE SUPORT
	* IE 7 CSS missing the next prev btn --- to be fixed
	EXTRA
		DONE * Create vertical gallery with option
		* create an visual line ofer the image to show "time" when the image it's switching
		* JS request supprot --- AT This moment saves only into the cookies but not building the list based on JS request
		* current stage saves into cookies
		* there are 2 types of cookies one for thumbs one for big images
	DONE * BUG on reset button
	DONE * BUG ON MOVE RIGHT
	DONE * on the init fn there is a set timeout don't forget to remove it
	DONE * return the number of images dinamilcy not hardcode e.g 13
	DONE * Make this entire object private
	DONE * NEXT ---- on click switch big image and thumb
	DONE * PREV ---- on click swith big image and thumb
	DONE * Thumb click --- get correct image
	DONE * highlight once gets out of the view scroll to the right position
	DONE * need to get the position of active thumb
	DONE * on movement create animation effect
	DONE * make auto animation to switch big image and thumb
	DONE * on the next or prev click reset the time to _CG duration so the animation will be interupted on click
	DONE * fix the fade in and fade out effects of the big images
	DONE * Create pause btn --- will stop the animation
	DONE * create play btn -- will resume the animation
	DONE * Build REST the slide animation from start with data from cookie
	DONE * Save - stops the scrolling animation and saves in cookies
		* need to set by default in cookies active which at the beginning will be 0
		* once the slider starts to move on save btn press that position needs to be updated and saved into the cookie with the new active value
		* on page refresh the slider has to start from the saved position
	DONE * remove button - will remove the current image and thumb including from the cookies
		* get the li big image and thumb and remove them based on the mObj.id
		* get the cookies remove the current image from it
		* set it again with the new values
	DONE * Each action of SAVE | REMOVE | RESET must show a popup with confirmation
	DONE * When cookies are set the list it's build but the cookies are not loaded and split it shows the html but not the cookies from images
	DONE * CAPTION object add image title not hardcoded text
	DONE * check for _CG settings of the buttons if they are disabled enabled etc.
	DONE * Create a fn which will display an general error message if something went wrong
	DONE * on thumb click we call a function which creates the first image on x = 0
	DONE * but when click on the thumb the image calls the thumbclick fn which returns an index --- this index it's not returning correct data
	DONE * for next click needs to increase + 1
	DONE * on prev click needs to decrease -1
	DONE * on thumb click needs to select the big image based on the returing id
	DONE * GET fn it's not working properly
		* the first time the page it's loaded the cookies are set but the get returns -1 instead of 0
		* when the get fn it's called the first time returns -1 in the build list and api
		* build the get only after the c_start returns 0 instead of -1
	DONE * on each fn send the active value of the current active thumb for saveing
*/