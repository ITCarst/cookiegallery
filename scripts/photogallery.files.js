_CG.files = new files();

function files(){
	
	var _files = this;
	/* ---------------------------------------
	 * create function that makes the ajax call in the folders
	 * ---------------------------------------- */
	this._options = {
		imageUrl: _CG._settings.imagesdir,
		thumbUrl: _CG._settings.thumbdir,
		fileTypes: /(.jpg)|(.gif)|(.png)|(.bmp)$/g,
		splitArray: /<li>|<a .*?>|<\/a>|<\/li>/ig //regex for removing unsed tags that are received from xml call through localhost ajax
	}
	/*var date = new Date().getTime(),
		imagesPath = _files._options.imageUrl,
		thumbPath = _files._options.thumbUrl,
		fileTypes = _files._options.fileTypes,
		splitArr = _files._options.splitArray,
		requestImages,
		requestThumbs;
		
	//request images from the img folder
	if(imagesPath && thumbPath){
		if(mainObjSettings.readFileType.rFServer === true){
			httpRequest(requestImages, imagesPath, fileTypes, splitArr);
		}else if(mainObjSettings.readFileType.rFClient === true){
			httpRequest(requestImages, imagesPath, fileTypes, splitArr);
			httpRequest(requestImages, thumbPath, fileTypes, splitArr);
		}
	}*/
}