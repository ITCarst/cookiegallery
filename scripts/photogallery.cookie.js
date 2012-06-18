/* TO DO
	* GET fn it's not working properly
		* the first time the page it's loaded the cookies are set but the get returns -1 instead of 0
		* when the get fn it's called the first time returns -1 in the build list and api
		* build the get only after the c_start returns 0 instead of -1
*/

_CG.cookie = new cookie();

function cookie(){
	var _cookie = this,
		cookieName = CGSettings.setCookieName,
		c_start = document.cookie.indexOf(cookieName + "="),
		c_end = document.cookie.indexOf(";" , c_start);

	//set cookies name|value|time
	this.set = function(name, value, time){
		//console.log(value)
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
		//console.log(name)
		if(document.cookie.length > 0 || document.cookie != ''){
			//check the CookieGallery by name
			if(c_start != -1){
				var getIndexes = _cookie.getCIndexes(c_start, c_end);
				var cookieName = name + '=',
					splitCookies = getIndexes.split(/,/),
					i = 0,
					c = [];
				for(i; i < splitCookies.length; i++){
					c.push(splitCookies[i]);
				}
				return c;
			}else{
				return '';
			}
		}else{
			return 'cookies are not set yet';
		}
	}
	/*
		if JS reading it's set build the second cookie for the thumbs
		check if the cookies are set receive and if the thumbs cookie its not set set thumb cookie
	*/
	this.checkCookies = function(returnImg, returnThumb){
		//if the thumbs img is false that means we have a php request to files
		if(returnThumb != false){
			var cName = 'CookieGalleryThumbs';
			_cookie.checkCGal(returnThumb, cName);
			_CG.cookie.set(cName, returnThumb, _CG._settings.expireTime);
		}else{
			//if its php request do the checking for cookie and set it
			_cookie.checkCGal(returnImg, cookieName);
		}
	}
	/*
		check the cookies are set
		if the cookie its already set make sure it's the cookie gallery
		if there are cookies but not the cookie gallery then set it
	*/ 
	this.checkCGal = function(_returnImgs, cName){
		if(_returnImgs != ''){
			//if there are no cookies then set our cookie
			if(document.cookie === '' || document.cookie.length <= 0 ){
				//set the cookies if there are not there
				_CG.cookie.set(cName, _returnImgs, _CG._settings.expireTime);
			}else{
				//get the start and end of your cookie appling expecialy of server has multiple cookies
				_cookie.getCIndexes(c_start, c_end, _returnImgs);
			}			
		}
	}
	//get the start and end of your cookie precaution if the ser,ver has already multiple cookies
	this.getCIndexes = function(startVal, endVal, receivedImg){
		//check if in cookies we find is the cookie gallery
		if(startVal != -1){
			startVal = startVal + cookieName.length + 1;
			if(endVal == -1) {
				endVal = document.cookie.length;
			}
			return unescape(document.cookie.substring(startVal, endVal));
		}else{
			_CG.cookie.set(cookieName, receivedImg, _CG._settings.expireTime);
		}
		
	}
	//remove cookie
	this.removeCurrentEntry = function(){
		
	}
	
}