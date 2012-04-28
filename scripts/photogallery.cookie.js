CookieGallery.cookie = new cookie();

function cookie(){
	var _cookie = this;

	//set cookies name|value|time
	this.set = function(name, value, time){
		if(time) {
			var date = new Date();
			date.setTime(date.getTime()+(time * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}else{
			var expires = "";
		}
		document.cookie = name + "= " + value + expires + "; path=/";
	}
	
	//get cookies 
	this.get = function(name){
		var cookieName = name + '=';
		var splitCookies = document.cookie.split(/;\s*/);
		//console.log(splitCookies)
	}
	
	this.checkCookies = function(returnImg, returnThumbs){
		
		if(document.cookie.length > 0){
			var nameEQ = 'CookieGalleryThumbs';
			var ca = document.cookie.split('/');
			
			console.log(ca)
			
		}
		
		if(returnImg != ''){
			//CookieGallery.cookie.set('CookieGallery' , JSON.stringify(returnImg), CookieGallery._settings.expireTime);
		}
		if(returnThumbs != ''){
			CookieGallery.cookie.set('CookieGalleryThumbs' , returnThumbs, CookieGallery._settings.expireTime);
		}
	}
	//clear cookies 
	this.clear = function(){
		console.log('clear cookie');
	}
	
	//remove cookie
	this.remove = function(name){
		this.setCookie(name, "", -1);
	}
	
}