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
				mainHolder.appendChild(thumbH);
				mainHolder.appendChild(infoH);
				imgHolder.appendChild(gControl);
				imgHolder.appendChild(imgIn);
				infoH.appendChild(prev);
				infoH.appendChild(photoName);
				infoH.appendChild(next);
				thumbH.appendChild(ulList);
				
				console.log(images)
				
				imgIn.innerHTML = images['Biolab+Disaster300X135.png'].outerHTML;
				
				
				
				
				
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
