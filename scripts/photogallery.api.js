/* TO DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  on the init fn there is a set timeout don't forget to remove it
  
  return the number of images dinamilcy not hardcode e.g 13
  
  GIVE SUPPROT FOR RETURNING images in JS
  
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
		enabled:true,
		fadeduration: 0.5, //fade in and fade out of the images change
		autorotate:{
			initialPause:0.2,
			enabled:true,
			duration:5000
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
	imgString:[],
	images:{},
	thumbs:{
        width:114,
        height:72
    },
	loaderGif: 'img/ajax-loader.gif' //image loader before everything it's loaded
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
			var images = _CG.images,
				preloadMsg = document.createElement('div');
				
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
					
					httpRequest(requestImages, imagesPath, fileTypes, splitArr, function(){
						var cookieGet = _CG.cookie.get(CGSettings.setCookieName);

						if(checkRequest === true){
							//test purpose only
							var doneParse = praseFiles(cookieGet, images, numResourcesLoaded);
							if(doneParse){
								_CG.buildList();
							}
						}
					});
					
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

function praseFiles(cGet, images, fLoaded){
	var _praseF = this;
	
	if(cGet != ''){
		setImages(cGet);
		doneLoading = true;
	}else{
		if(document.cookie.length > 0 || document.cookie != ''){
			var c_start = document.cookie.indexOf(_CG._settings.setCookieName + "="),
				c_end = document.cookie.indexOf(";" , c_start);
				
			if(c_start != -1){
				var getIndexes = _CG.cookie.getCIndexes(c_start, c_end);
				var cookieName = _CG._settings.setCookieName + '=',
					splitCookies = getIndexes.split(/,/),
					i = 0,
					c = [];
				for(i; i < splitCookies.length; i++){
					c.push(splitCookies[i]);
				}				
				setImages(c);
				doneLoading = true;
			}
		}
	}
	function setImages(c){
		var preloadMsg = document.getElementById('preloadMsg');
		for(var i=0; i < c.length; i++){
			//remove the thumb_ from cookie name that it's set into php|JS
			var matchT = c[i].match(/thumb_/),
				replaceT = c[i].replace(matchT, ''),
				stringImg = [];
			
			if(matchT){
				stringImg += (CGSettings.thumbdir + replaceT);
			}else{
				stringImg += (CGSettings.imagesdir + replaceT);
			}
			
			images[replaceT] = new Image();
			
			images[replaceT].onload = function(){
				//check if images status
				if(this.complete === true){
					//add +1 to counter
					fLoaded += 1;
					if(6 === fLoaded){
						console.log('loaded')
						//if counter its = with all images then hide loading msg
						preloadMsg.style.display = 'none';
					}
				}
			}
			//add source to img
			images[replaceT].src = stringImg;
			_CG.imgString.push(stringImg);
		}
		
	}
	return true;
}