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
	console.log('loaded')
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
		console.log('init')
			var images = mainObj.images,
				preloadMsg = document.createElement('div');
				
				
			var date = new Date().getTime(),
				imagesPath = CookieGallery.files._options.imageUrl,
				thumbPath = CookieGallery.files._options.thumbUrl,
				fileTypes = CookieGallery.files._options.fileTypes,
				splitArr = CookieGallery.files._options.splitArray,
				requestImages,
				requestThumbs;
				
			preloadMsg.setAttribute('id', 'preloadMsg');
			preloadMsg.innerHTML = '<img src="' + mainObj.loaderGif + '" border="0">';
			// <br/>'+'Loading... (' + ( 100 / 13 ) * numResourcesLoaded + '%)
			mainHolder.appendChild(preloadMsg);
	
			//request images from the img folder
			if(imagesPath && thumbPath){
				
				if(mainObjSettings.readFileType.rFServer === true){
					console.log('make request')
					httpRequest(requestImages, imagesPath, fileTypes, splitArr);
					cookieGet = CookieGallery.cookie.get(mainObjSettings.setCookieName);
					
					console.log('done request');
					if(checkRequest === true){
						console.log('true reqest')
						praseFiles(cookieGet,images, numResourcesLoaded)
					}else{
						console.log('not true yet')
					}
					
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
function praseFiles(cGet,images, fLoaded){
	console.log('parse files')
	//get cookie length
		for(var i=0; i < cGet.length; i++){
			//remove the thumb_ from cookie name that it's set into php|JS
			var matchT = cGet[i].match(/thumb_/),
				replaceT = cGet[i].replace(matchT, ''),
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
					console.log(this.complete)
					//add +1 to counter
					fLoaded += 1;
					
					if(13 === fLoaded){
					
						console.log('hide loading')
						//if counter its = with all images then hide loading msg
						preloadMsg.style.display = 'none';
					
					}
				}
			}
			//add source to img
			images[replaceT].src = concatImgs;
		}
}