CookieGallery.cookie = new cookie();

function cookie(){
	var _cookie = this,
		cookieName = CookieGallery._settings.setCookieName;
	
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
		/*
		if(document.cookie.length > 0 ){
			
			//get the start and end of your cookie precaution if the server has already multiple cookies
			var c_start = document.cookie.indexOf(name + "="),
				c_end = document.cookie.indexOf(";" , c_start);
			
			//check the CookieGallery by name
			if(c_start != -1){
				
				c_start = c_start + name.length + 1;
				
				//console.log(c_end);
				
				if(c_end == -1) {
					
					c_end = document.cookie.length;
					
					//console.log(c_end);
					
				}
				return unescape(document.cookie.substring(c_start, c_end));
				
			}
			
			var cName = name + '=',
				splitCookies = document.cookie.split(/;/),
				i = 0,
				c = [];
			
		}		
		/*
		var cookieName = name + '=',
			splitCookies = document.cookie.split(/,|=|CookieGallery/),
			i = 0,
			c = [];
			
			
			
			
		console.log(splitCookies);*/
		/*
		for(i; i < splitCookies.length; i++){
			c.push(splitCookies[i]);
		}
		
		console.log(c);
		return c;*/
		
	}
	//fn for checking and setting the cookies with the images received from json
	this.checkCookies = function(returnImg, returnThumb){
		
		
		//if the thumbs img is false that means we have a php request to files
		if(returnThumb != false){
			var _returnImgs = returnThumb;
			
			
			
			
			CookieGallery.cookie.set('CookieGalleryThumbs', _returnImgs, CookieGallery._settings.expireTime);
			
			
			
		}else{
			var _returnImgs = returnImg;
		}
		
		
		if(_returnImgs != ''){
			

			
			
		}
		
		this.checkCGal = function(){
			
			//if there are no cookies then set our cookie
			if(document.cookie === '' || document.cookie.length < 0 ){
				//set the cookies if there are not there
				CookieGallery.cookie.set(cookieName, _returnImgs, CookieGallery._settings.expireTime);
				
			}else{
				
				//get the start and end of your cookie appling expecialy of server has multiple cookies
				var c_start = document.cookie.indexOf(cookieName + "="),
					c_end = document.cookie.indexOf(";" , c_start);
				//check if in cookies we find our cookie gallery
				if(c_start != -1){
					c_start = c_start + name.length + 1;

					if(c_end == -1) {
						c_end = document.cookie.length;
					}
					var substringCookie = unescape(document.cookie.substring(c_start, c_end));
					console.log(substringCookie);
					
				}else{
					//console.log('set our cokoie')
					CookieGallery.cookie.set(cookieName, _returnImgs, CookieGallery._settings.expireTime);
				}
				
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