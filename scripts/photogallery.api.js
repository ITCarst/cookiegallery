//append main obj to window obj
if(!window.CookieGallery) {
    window.CookieGallery = {};
}

CookieGallery = {
	preload:true,
	autoplay:{
        buttons:{
            start:{
                txt:'',
                enabled:true
            },
            stop:{
                txt:'',
                enabled:true
            },
			remove:{
                txt:'',
                enabled:true
            }
        },
		fadeduration: 10000,
		autorotate:{
			enabled:true,
			duration:3000
		}
    },	
	_settings: {
		placeTarget		: 'gallery-module',
		imagesdir		: 'gallery-images/',
		thumbdir		: '/gallery-images/thumbs',
		readFiles		: 'readfiles.php',
		expireTime		: 365 //xpire cookie in days --> default 1 year //if days are not added will expire on browser closing
	},
	thumbs:{
        width:0,
        height:0
    },
	loaderGif: 'img/ajax-loader.gif'
};

//window load show preloader
window.onload = function(){
	CookieGallery.init = new init();
}

//image/cookie/requests preloader
var init = function(){
	
	var mainObj = CookieGallery,
		objSettings = CookieGallery._settings,
		preloadMsg = document.createElement('div');
	
	preloadMsg.setAttribute('id', 'preloadMsg');
	preloadMsg.innerHTML = '<img src="' + mainObj.loaderGif + '" border="0">';
	
	
	var tca = CookieGallery.cookie.get('CookieaGallery');
	
	console.log(tca);
	
	//if target it's defined add the loader	
	if(objSettings.placeTarget != ''){
		var mainHolder = document.getElementById(objSettings.placeTarget);
		if(mainHolder){
			mainHolder.appendChild(preloadMsg);
		}else{
			alert('your defined id doesn\'t match the api id');
		}
	}else{
		alert('you must define an id for the gallery placeholder');
	}

	//get obj length
	/*for(var i=0; i < allImages.length; i++){
		images[allImages[i]] = new Image();
		images[allImages[i]].onload = function(){
			//check if images status
			if(this.complete === true){
				//add +1 to counter
				numResourcesLoaded += 1;
				preloadMsg.innerHTML = 'Loading... (' + ( 100 / totalResources ) * numResourcesLoaded + '%)';
				if(totalResources === numResourcesLoaded){
					//if counter its = with all images then hide loading msg
					preloadMsg.style.display = 'none';
					donePreloading();
				}
			}
		}
		//add source to img
		images[allImages[i]].src = 'img/' + allImages[i] + '.png';
	}*/
}


//general fn for makeing the ajax request in the folders
function httpRequest(xhr, path, filetype, splitArr){
	var _xhr = xhr,
		retrunImageFiles = [],
		returnImageThumb = '',
		count = 0,
		total = 0,
		sendUrl = CookieGallery._settings.readFiles + '?path=' + path;
	
	console.log(path)
	
	if(window.XMLHttpRequest) {
		_xhr = new XMLHttpRequest();
	}else if(window.ActiveXObject) {
		try{
			_xhr = ActiveXObject("Msxml2.XMLHTTP.6.0");
		}catch(e) {
			try{
				_xhr = ActiveXObject("Msxml2.XMLHTTP.3.0");
			}catch(e) {
				try{
					_xhr = ActiveXObject("Microsoft.XMLHTTP");
				}catch(e) {
					console.log("This browser does not support XMLHttpRequest." + e);		
				}
			}
		}	
	}
	if(_xhr){
		_xhr.onreadystatechange = function(){
			if(_xhr.readyState == 4){
				if (_xhr.status == 200) {
					
					var responeTxt = _xhr.responseText,
						matchExtension = responeTxt.match(filetype);
					
					//check for images extenstions and if the response it's bigger then 0	
					if(matchExtension && responeTxt.length > 0 && responeTxt.length != '' ){
						
						/* ---------------------------------
						 * PHP JSON RESPONSE
						 * --------------------------------- */
						//parse the json response
						var parseResponse = JSON.parse(responeTxt);
						
						for(var x = 0; x < parseResponse.length; x++){
							//check matches for extension from the json
							if(parseResponse[x].match(filetype)){
								//push images into the empty array
								retrunImageFiles.push(parseResponse[x]);
							}
						}
						if(retrunImageFiles != ''){
							CookieGallery.cookie.checkCookies(retrunImageFiles);
						}
						/* -------------------------------
						 * LOCAL HOST REQUEST AND PARSE
						 *  ------------------------------ 
						//remove the a tag so it wont get duplicated entries
						var splitArray = responeTxt.split(splitArr);
						
						//loop through the array and get the founded files from dir
						for(var x = 0; x < splitArray.length; x++){
							count++;
							//check matches for extension from the array
							if(splitArray[x].match(filetype)){
								//check for path and if it's thumb then add thumb to the small images
								if(path === CookieGallery._settings.imagesdir){
									retrunImageFiles += splitArray[x];
								}
								if(path === CookieGallery._settings.thumbdir){
									returnImageThumb += 'thumb_' + splitArray[x] + ' ';
								}
							}
						}
						if(count == total){
							CookieGallery.cookie.checkCookies(retrunImageFiles, returnImageThumb);
						}*/
						
					}else{
						console.log('you don\'t have any images in folders');
					}
				}else{
					console.log("Error Code:" + _xhr.status + ' Error Type:' + _xhr.statusText);  
				}
			}
		}
		//php get requst
		_xhr.open("GET", sendUrl, true);
		
		//localhost request returing 
		//_xhr.open("GET", path, true);
		_xhr.send(null);
	}
}