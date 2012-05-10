function buildList(){
	var _list = this;
	
	if(mainObjSettings.placeTarget != ''){
		var mainHolder = document.getElementById(mainObjSettings.placeTarget);
		var cookieGet = CookieGallery.cookie.get(mainObjSettings.setCookieName);
		var images = mainObj.images;
		
		if(mainHolder){
	
			if(doneLoading === true){
				
				//create html elements for layout
				var imgHolder = document.createElement('div'),
					gControl = document.createElement('div'),
					imgIn = document.createElement('div'),
					infoH = document.createElement('div'),
					prev = document.createElement('div'),
					photoName = document.createElement('div'),
					next = document.createElement('div'),
					thumbH = document.createElement('div'),
					ulList = document.createElement('ul');
					
				//add individual ID's to each elem creted	
				imgHolder.setAttribute('id', 'imgHolder');
				gControl.setAttribute('id', 'controlls');
				imgIn.setAttribute('id', 'imgIn');
				infoH.setAttribute('id', 'infoH');
				prev.setAttribute('id','prev');
				next.setAttribute('id','next');
				photoName.setAttribute('id','photName');
				thumbH.setAttribute('id','thumbH');
				
				//created HTML elems append them to the proper elems
				mainHolder.appendChild(imgHolder);
				mainHolder.appendChild(infoH);
				mainHolder.appendChild(thumbH);
				imgHolder.appendChild(gControl);
				imgHolder.appendChild(imgIn);
				infoH.appendChild(prev);
				infoH.appendChild(photoName);
				infoH.appendChild(next);
				thumbH.appendChild(ulList);
				
				var returnedImages = mainObj.imgString;
				var thumbs = [];
				var bigImgs = [];
				var matchUrl = /\/thumbs/i;
				
				var tWidth = mainObj.thumbs.width;
				var tHeight = mainObj.thumbs.height;
				
				//return separatly the thumbs and big images
				for(var i = 0; i < returnedImages.length; i++){
					//get the thumbs and palce them in the list
					if(returnedImages[i].match(matchUrl)){
						thumbs.push(returnedImages[i]);
					}else{
						bigImgs.push(returnedImages[i]);
					}
				}
				for(var x = 0; x < thumbs.length; x++){
					var createImgT = new Image();
					var liList = document.createElement('li');
					
					createImgT.width = tWidth;
					createImgT.height = tHeight;
					
					createImgT.src = thumbs[x];
					ulList.appendChild(liList);
					

					ulList.appendChild(liList);
					liList.appendChild(createImgT);
				}
				
				for(var z = 0; z < bigImgs.length; z++){
					var createImg = new Image();
					createImg.src = bigImgs[z];
					imgIn.appendChild(createImg);
				}
				
			}
		}
	}
}

/*
GALL STRUCTURE

<div id="imgHolder">
	<div id="controlls"> Controlls: Reset | Pause | Save </div>
	<div id="imgIn"> Big Image	</div>
</div>

<div id="infoH">
	<div class="prev">Previous</div>		<div class="photoName">Photo Name</div>		<div class="next">Next</div>
</div>

<div class="thumbH">
	<ul>
	<li>Thumb</li><li>Thumb</li><li>Thumb</li><li>Thumb</li><li>Thumb</li>
	</ul>
</div>

*/
