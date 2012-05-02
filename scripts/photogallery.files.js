CookieGallery.files = new files();

function files(){
	var _files = this;
	/* ---------------------------------------
	 * create function that makes the ajax call in the folders
	 * ---------------------------------------- */
	var ajaxRequest = function(){
		var _request = this;
		
		this._options = {
			imageUrl: CookieGallery._settings.imagesdir,
			thumbUrl: CookieGallery._settings.thumbdir,
			fileTypes: /(.jpg)|(.gif)|(.png)|(.bmp)$/g,
			splitArray: /<li>|<a .*?>|<\/a>|<\/li>/ig //regex for removing unsed tags that are received from xml call through localhost ajax
		}
		var date = new Date().getTime();
		var imagesPath = _request._options.imageUrl,
			thumbPath = _request._options.thumbUrl,
			fileTypes = _request._options.fileTypes,
			splitArr = _request._options.splitArray,
			requestImages,
			requestThumbs;
			
		//request images from the img folder
		if(imagesPath && thumbPath){
			httpRequest(requestImages, imagesPath, fileTypes, splitArr);
		}
		
		//second request for localhost option
		//request thumbs from the folder
		/*if(thumbPath){
			httpRequest(requestThumbs, thumbPath, fileTypes, splitArr);
		}*/
		
	}
	_files.ajaxRequest = new ajaxRequest();
}