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
		placeTarget		: 'gallery-module', //main target wichi is required in the html
		imagesdir		: 'gallery-images/', //folder of the big images -- 
		thumbdir		: 'gallery-images/thumbs', //name and path of the thumbs folder
		readFiles		: 'readfiles.php', //php file wich opens|reads the files from folders
		expireTime		: 365, //xpire cookie in days --> default 1 year //if days are not added will expire on browser closing
		setCookieName	: 'CookieGallery', //define the name of the cookie that will hold the imgs
		readFileType	: { //setting for enableing either php reading file or JS reading dir through ajax
			rFServer	: false, 
			rFClient	: true //this option will make 2 ajax requests one for images dir and one for thumbs
		}
	},
	images:{},
	thumbs:{
        width:0,
        height:0
    },
	loaderGif: 'img/ajax-loader.gif' //image loader before everything it's loaded
};

//window load show preloader
window.onload = function(){
	CookieGallery.init = new init();
}

var mainObj = CookieGallery,
	mainObjSettings = CookieGallery._settings;


//image/cookie/requests preloader
var init = function(){
	var images = mainObj.images,
		preloadMsg = document.createElement('div'),
		numResourcesLoaded,
		cookieGet = CookieGallery.cookie.get(mainObjSettings.setCookieName);
	
	preloadMsg.setAttribute('id', 'preloadMsg');
	preloadMsg.innerHTML = '<img src="' + mainObj.loaderGif + '" border="0">';
	
	//console.log(cookieGet);
//	
	//get obj length
	/*for(var i=0; i < cookieGet.length; i++){
		
		images[cookieGet[i]] = new Image();
		images[cookieGet[i]].onload = function(){
			//check if images status
			if(this.complete === true){
				//add +1 to counter
				numResourcesLoaded += 1;
				preloadMsg.innerHTML = 'Loading... (' + ( 100 / totalResources ) * numResourcesLoaded + '%)';
				if(totalResources === numResourcesLoaded){
					//if counter its = with all images then hide loading msg
					preloadMsg.style.display = 'none';
					donePreloading(objSettings.placeTarget,preloadMsg);
				}
			}
		}
		//add source to img
		images[cookieGet[i]].src = objSettings.imagesdir + cookieGet[i];
		
	}*/
}
function donePreloading(target, loadMsg){
	//if target it's defined add the loader	
	if(target != ''){
		var mainHolder = document.getElementById(target);
		//check if gallery-module exisits
		if(mainHolder){
			mainHolder.appendChild(loadMsg);
		}else{
			alert('your defined id doesn\'t match the api id');
		}
	}else{
		alert('you must define an id for the gallery placeholder');
	}
}

//general fn for makeing the ajax request in the folders
function httpRequest(xhr, path, filetype, splitArr){
	var _xhr = xhr,
		retrunImageFiles = [],
		returnImageThumb = '',
		count = 0,
		total = 0,
		sendUrl = mainObjSettings.readFiles + '?path=' + path; //url for read file server side
	
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
							console.log('request made')

						if(mainObjSettings.readFileType.rFServer === true){
							console.log('php reading');
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
								CookieGallery.cookie.checkCookies(retrunImageFiles, false);
							}
							
						}else if(mainObjSettings.readFileType.rFClient === true){

							/* -------------------------------
							 * LOCAL HOST REQUEST AND PARSE
							 *  ------------------------------ */ 
							//remove the a tag so it wont get duplicated entries
							var splitArray = responeTxt.split(splitArr);
							total = splitArray.length;
							
							//loop through the array and get the founded files from dir
							for(var x = 0; x < splitArray.length; x++){
								count++;
								//check matches for extension from the array
								if(splitArray[x].match(filetype)){
									//check for path and if it's thumb then add thumb to the small images
									if(path === mainObjSettings.imagesdir){
										retrunImageFiles += splitArray[x];
									}
									if(path === mainObjSettings.thumbdir){
										returnImageThumb += 'thumb_' + splitArray[x] + ' ';
									}
								}
							}
							if(count == total){
								CookieGallery.cookie.checkCookies(retrunImageFiles, returnImageThumb);
							}
						}else{
							console.log('please make sure you have enabled one reading file option')
						}
					}else{
						console.log('you don\'t have any images in folders');
					}
				}else{
					console.log("Error Code:" + _xhr.status + ' Error Type:' + _xhr.statusText);  
				}
			}
		}
		if(mainObjSettings.readFileType.rFServer === true){
			//php get requst
			_xhr.open("GET", sendUrl, true);
		}else if(mainObjSettings.readFileType.rFClient === true){
			//localhost request returing 
			_xhr.open("GET", path, true);
		}
		_xhr.send(null);
	}
}