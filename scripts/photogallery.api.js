/* TO DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  BUG whem loading cookie the c_start even its there returns bad
  build preloader its not loading the files after the request
  make preloader work
  GIVE SUPPROT FOR PARSING THE JS REQUEST OF THE IMAGES not its only php cookie and readig files based
 return the number of images dinamilcy not hardcode e.g 13
 
*/


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
		thumbdir		: 'gallery-images/thumbs/', //name and path of the thumbs folder
		readFiles		: 'readfiles.php', //php file wich opens|reads the files from folders
		expireTime		: 365, //xpire cookie in days --> default 1 year //if days are not added will expire on browser closing
		setCookieName	: 'CookieGallery', //define the name of the cookie that will hold the imgs
		readFileType	: { //setting for enableing either php reading file or JS reading dir through ajax
			rFServer	: true, 
			rFClient	: false //this option will make 2 ajax requests one for images dir and one for thumbs
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
	init();
}

var mainObj = CookieGallery,
	mainObjSettings = CookieGallery._settings,
	checkRequest = false,
	numResourcesLoaded = 0;


//image/cookie/requests preloader
function init (){
	
	if(mainObjSettings.placeTarget != ''){
		var mainHolder = document.getElementById(mainObjSettings.placeTarget);
		//check if gallery-module exisits
		if(mainHolder){
			var images = mainObj.images,
				preloadMsg = document.createElement('div');
				
				
			var date = new Date().getTime(),
				imagesPath = CookieGallery.files._options.imageUrl,
				thumbPath = CookieGallery.files._options.thumbUrl,
				fileTypes = CookieGallery.files._options.fileTypes,
				splitArr = CookieGallery.files._options.splitArray,
				requestImages = '',
				requestThumbs = '';
				
			preloadMsg.setAttribute('id', 'preloadMsg');
			preloadMsg.innerHTML = '<img src="' + mainObj.loaderGif + '" border="0">';
			// <br/>'+'Loading... (' + ( 100 / 13 ) * numResourcesLoaded + '%)
			mainHolder.appendChild(preloadMsg);
	
			//request images from the img folder
			if(imagesPath && thumbPath){
				
				if(mainObjSettings.readFileType.rFServer === true){
					
					httpRequest(requestImages, imagesPath, fileTypes, splitArr, function(){
						
						if(checkRequest === true){
							
							var cookieGet = CookieGallery.cookie.get(mainObjSettings.setCookieName);
							
							setTimeout(function(){
							
								praseFiles(cookieGet, images, numResourcesLoaded);
								
							},1000)	
								
						}else{
							console.log('not true yet')
						}
					});
					
					
				}else if(mainObjSettings.readFileType.rFClient === true){
					httpRequest(requestImages, imagesPath, fileTypes, splitArr);
					httpRequest(requestImages, thumbPath, fileTypes, splitArr);
				}
			}	
		}else{
			alert('your defined id doesn\'t match the api id');
		}
	}else{
		alert('you must define an id for the gallery placeholder');
	}
}

function praseFiles(cGet, images, fLoaded){
	var _praseF = this;
	
	if(cGet != ''){
		setImages(cGet);
	}else{
		if(document.cookie.length > 0 || document.cookie != ''){
			var c_start = document.cookie.indexOf(CookieGallery._settings.setCookieName + "="),
				c_end = document.cookie.indexOf(";" , c_start);
				
			if(c_start != -1){
				var getIndexes = CookieGallery.cookie.getCIndexes(c_start, c_end);
				var cookieName = CookieGallery._settings.setCookieName + '=',
					splitCookies = getIndexes.split(/,/),
					i = 0,
					c = [];
				for(i; i < splitCookies.length; i++){
					c.push(splitCookies[i]);
				}				
				setImages(c);
			}
		}
		
	}
	function setImages(c){
		for(var i=0; i < c.length; i++){
			//remove the thumb_ from cookie name that it's set into php|JS
			var matchT = c[i].match(/thumb_/),
				replaceT = c[i].replace(matchT, ''),
				concatImgs = [];
			
			images[replaceT] = new Image();
			
			if(matchT){
				concatImgs += (mainObjSettings.thumbdir + replaceT);
			}else{
				concatImgs += (mainObjSettings.imagesdir + replaceT);
			}
			
			images[replaceT].onload = function(){
				//check if images status
				if(this.complete === true){
					//add +1 to counter
					fLoaded += 1;
					if(13 === fLoaded){
						//if counter its = with all images then hide loading msg
						preloadMsg.style.display = 'none';
					}
				}
			}
			//add source to img
			images[replaceT].src = concatImgs;
		}
	}
}