//general fn for makeing the ajax request in the folders
function httpRequest(xhr, path, filetype, splitArr, callback){
	var _xhr = xhr,
		retrunImageFiles = [],
		returnImageThumb = '',
		count = 0,
		total = 0,
		sendUrl = CGSettings.readFiles + '?path=' + path; //url for read file server side
	
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
							
						if(CGSettings.readFileType.rFServer === true){
							
							/* ---------------------------------
							 * PHP JSON RESPONSE
							 * --------------------------------- */
							var parseResponse = JSON.parse(responeTxt);
							
							for(var x = 0; x < parseResponse.length; x++){
								//check matches for extension from the json
								if(parseResponse[x].match(filetype)){
									//push images into the empty array
									retrunImageFiles.push(parseResponse[x]);
								}
							}
							if(retrunImageFiles != ''){
								callback(_CG.cookie.checkCookies(retrunImageFiles, false));
							}
							
						}else if(CGSettings.readFileType.rFClient === true){

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
		if(CGSettings.readFileType.rFServer === true){
			//php get requst
			_xhr.open("GET", sendUrl, true);
		}else if(CGSettings.readFileType.rFClient === true){
			//localhost request returing 
			_xhr.open("GET", path, true);
		}
		checkRequest = true;
		_xhr.send(null);
	}
}