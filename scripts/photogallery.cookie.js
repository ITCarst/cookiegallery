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
		var cookieName = name + '=',
			splitCookies = document.cookie.split(/,|=/),
			i = 0,
			c = [];
			
		for(i; i < splitCookies.length; i++){
			c.push(splitCookies[i]);
			//console.log(c);
		}
		return c;
		
	}
	//fn for checking and setting the cookies with the images received from json
	this.checkCookies = function(returnImg){
		if(returnImg != ''){
			//if the cookie gallery hasen't been set then set it
			if(document.cookie === '' || document.cookie == 0){
				//set the cookies if there are not there
				CookieGallery.cookie.set('CookieGallery', returnImg, CookieGallery._settings.expireTime);
			}
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