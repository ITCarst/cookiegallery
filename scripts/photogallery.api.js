/* TO DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  * on the init fn there is a set timeout don't forget to remove it
  * imgString and images objects has to be privatg
  * return the number of images dinamilcy not hardcode e.g 13
  * GIVE SUPPROT FOR ONLY JS OPTION
  * Refactoring
  
*/
//append main obj to window obj
if(!window.CookieGallery) {
    window.CookieGallery = {};
}
//Cookie Gallery
_CG = {
	preload:true,
	autoplay:{
        buttons:{
            play:{
                txt:'Play',
                enabled:true
            },
            pause:{
                txt:'Pause',
                enabled:true
            },
			remove:{
                txt:'Remove',
                enabled:true
            },
			reset: {
				txt:'Reset',
                enabled:true
			},
			save: {
				txt:'Save',
				enabled:true
			}
        },
		enabled:true,
		fadeduration: 0.7, //fade in and fade out of the images change
		autorotate:{
			initialPause: 0.2,
			enabled: true,
			duration: 2000,
			startPos: 0
		}
    },
	_settings: {
		placeTarget		: 'CGallery', //main target wichi is required in the html
		imagesdir		: 'gallery-images/', //folder of the big images -- 
		thumbdir		: 'gallery-images/thumbs/', //name and path of the thumbs folder
		readFiles		: 'readfiles.php', //php file wich opens|reads the files from folders
		expireTime		: 365, //xpire cookie in days --> default 1 year //if days are not added will expire on browser closing
		setCookieName	: 'CookieGallery', //define the name of the cookie that will hold the imgs
		readFileType	: { //setting for enableing either php reading file or JS reading dir through ajax
			rFServer	: true, 
			rFClient	: false //this option will make 2 ajax requests one for images dir and one for thumbs
		},
		fileTypes: /(.jpg)|(.gif)|(.png)|(.bmp)$/g,
		splitArray: /<li>|<a .*?>|<\/a>|<\/li>/ig //regex for removing unsed tags that are received from xml call through localhost ajax
	},
	isActive: 0,
	images:{},
	thumbs:{
        width:114,
        height:72
    },
	loaderGif: 'img/loader.gif' //image loader before everything it's loaded
};

//window load show preloader
window.onload = function(){
	_CG.init = new init();
}

var CGSettings = _CG._settings,
	checkRequest = false,
	doneLoading = false;
	numResourcesLoaded = 0;

//image/cookie/requests preloader
var init = function(){
	if(CGSettings.placeTarget != ''){
		var mainHolder = document.getElementById(CGSettings.placeTarget);
		//check if gallery-module exisits
		if(mainHolder){
			var preloadMsg = document.createElement('div');
				
			var date = new Date().getTime(),
				imagesPath = CGSettings.imagesdir,
				thumbPath = CGSettings.thumbdir,
				fileTypes = CGSettings.fileTypes,
				splitArr = CGSettings.splitArray,
				requestImages = '',
				requestThumbs = '';
			
			preloadMsg.setAttribute('id', 'preloadMsg');
			preloadMsg.innerHTML = '<img src="' + _CG.loaderGif + '" border="0">';
			// <br/>'+'Loading... (' + ( 100 / 13 ) * numResourcesLoaded + '%)
			mainHolder.appendChild(preloadMsg);
	
			//request images from the img folder
			if(imagesPath && thumbPath){
				
				if(CGSettings.readFileType.rFServer === true){
					
					//check if cookies are set so it doesn't make an extra request
					if(document.cookie.length > 0 || document.cookie != ''){
						var results = document.cookie.match(CGSettings.setCookieName + '=(.*?)(;|$)');
						//if the cookies dosen't match then do an other request witch will get our images
						if(results){
							returnCookie();
						}else{
							httpRequest(requestImages, imagesPath, fileTypes, splitArr, function(){
								console.log("REQUEST CALLBACK");
								if(checkRequest === true){
									console.log("CHECKED SET TRUE");
									returnCookie();
								}
							});	
						}
					}else{
						httpRequest(requestImages, imagesPath, fileTypes, splitArr, function(){
							console.log("REQUEST CALLBACK");
							if(checkRequest === true){
								console.log("CHECKED SET TRUE");
								returnCookie();
							}
						});						
					}
					
				}else if(CGSettings.readFileType.rFClient === true){
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


function praseFiles(images, fLoaded){
	var _praseF = this;
	var cGet = _CG.cookie.get(CGSettings.setCookieName);
	
	if(cGet != ''){
		if(setImages(cGet)){
			doneLoading = true;
			return true;
		}
	}else{
		var c = _CG.cookie.get(CGSettings.setCookieName);
		if(c){
			if(setImages(c)){
				doneLoading = true;
				return true;
			}
		}
	}
	
	function setImages(c){
		var preloadMsg = document.getElementById('preloadMsg');
		//Reads the cookie and strips the thumbs and other aditions
		//adds the path to the images + image name and saves it into an image obj and an image array
		//do the loader
		
		for(var i=0; i < c.length; i++){
			//remove the thumb_ from cookie name that it's set into php|JS
			var matchT = c[i].match(/thumb_/),
				matchA = c[i].match('active_' + _CG.isActive),
				replaceA = c[i].replace(matchA, ''),
				replaceT = c[i].replace(matchT, ''),
				stringImg = [];
			
			if(matchT){
				stringImg += (CGSettings.thumbdir + replaceT);
			}else if(matchA){
				stringImg += replaceA;
			}else{
				stringImg += (CGSettings.imagesdir + replaceT);
			}
			//console.log(replaceT)
			images[stringImg] = new Image();
			images[stringImg].onload = function(){
				//check if images status
				if(this.complete === true){
					//add +1 to counter
					fLoaded += 1;
					if(6 === fLoaded){
						//if counter its = with all images then hide loading msg
						preloadMsg.style.display = 'none';
					}
				}
			}
			//add source to img
			images[stringImg].src = stringImg;
		}
		if(_CG.images){
			return true;
		}
	}
}
function returnCookie (){
	var doneParse = praseFiles(_CG.images, numResourcesLoaded);
	if(doneParse){
		_CG.buildList();
	}
}
