/* TO DO
	DONE * GET fn it's not working properly
			* the first time the page it's loaded the cookies are set but the get returns -1 instead of 0
			* when the get fn it's called the first time returns -1 in the build list and api
			* build the get only after the c_start returns 0 instead of -1
	* on each fn send the active value of the current active thumb for saveing
*/

_CG.cookie = new cookie();

function cookie(){
	var _cookie = this,
		cookieName = CGSettings.setCookieName,
		c_start = document.cookie.indexOf(cookieName + "="),
		c_end = document.cookie.indexOf(";" , c_start);

	//set cookies name|value|time
	this.set = function(name, value, time, active){
		//add to cookie the images value + the saved image
		value = value + ',active_' + active;
		if(time) {
			var date = new Date();
			date.setTime(date.getTime()+(time * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}else{
			var expires = "";
		}
		document.cookie = name + "= " + value + expires + "; path=/";
		checkRequest = true;		
	}
	//get cookies 
	this.get = function(check_name){
		// first we'll split this cookie up into name/value pairs
		// note: document.cookie only returns name=value, not the other components
		var a_all_cookies = document.cookie.split(';');
		var a_temp_cookie = '';
		var cookie_name = '';
		var cookie_value = '';
		var b_cookie_found = false; // set boolean t/f default f
	
		for( i = 0; i < a_all_cookies.length; i++ ){
			// now we'll split apart each name=value pair
			a_temp_cookie = a_all_cookies[i].split( '=' );
	
			// and trim left/right whitespace while we're at it
			cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
			// if the extracted name matches passed check_name
			if(cookie_name == check_name ) {
				b_cookie_found = true;
				// we need to handle case where cookie has no value but exists (no = sign, that is):
				if(a_temp_cookie.length > 1){
					cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
					cookie_value = cookie_value.split(/,/);
				}
				// note that in cases where cookie is initialized but no value, null is returned
				return cookie_value;
				break;
			}
			a_temp_cookie = null;
			cookie_name = '';
		}
		if(!b_cookie_found){
			return null;
		}		
	}
	/*
		if JS reading it's set build the second cookie for the thumbs
		check if the cookies are set receive and if the thumbs cookie its not set set thumb cookie
	*/
	this.checkCookies = function(returnImg, returnThumb, active){
		//if the thumbs img is false that means we have a php request to files
		if(returnThumb != false){ //JS CALL
			var cName = 'CookieGalleryThumbs';
			_cookie.checkCGal(returnThumb, cName, active);
			_cookie.set(cName, returnThumb, _CG._settings.expireTime, active);
		}else{
			//if its php request do the checking for cookie and set it
			_cookie.checkCGal(returnImg, cookieName, active);
		}
	}
	/*
		check the cookies are set
		if the cookie its already set make sure it's the cookie gallery
		if there are cookies but not the cookie gallery then set it
	*/ 
	this.checkCGal = function(_returnImgs, cName, active){
		if(_returnImgs != ''){
			//if there are no cookies then set our cookie
			if(document.cookie === '' || document.cookie.length <= 0 ){
				//set the cookies if there are not there
				_cookie.set(cName, _returnImgs, _CG._settings.expireTime, active);
			}else{
				//get the start and end of your cookie appling expecialy of server has multiple cookies
				_cookie.getCIndexes(c_start, c_end, _returnImgs, active);
			}			
		}
	}
	//get the start and end of your cookie precaution if the server has already multiple cookies
	this.getCIndexes = function(startVal, endVal, receivedImg, active){
		//check if in cookies we find is the cookie gallery
		if(startVal != -1){
			console.log('here')
			startVal = startVal + cookieName.length + 1;
			if(endVal == -1) {
				endVal = document.cookie.length;
			}
			return unescape(document.cookie.substring(startVal, endVal));
		}else{
			_cookie.set(cookieName, receivedImg, _CG._settings.expireTime, active);
		}
		
	}
	this.updateValues = function(name, value, time){
		if(time) {
			var date = new Date();
			date.setTime(date.getTime()+(time * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}else{
			var expires = "";
		}
		document.cookie = name + "= " + value + expires + "; path=/";
	}
	//remove cookie
	this.removeCurrentEntry = function(){
		
	}
}