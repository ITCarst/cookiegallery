var ci;

function buildList(){
	var _list = this;
	
	if(CGSettings.placeTarget != ''){
		var mainHolder = document.getElementById(CGSettings.placeTarget);
		var cookieGet = _CG.cookie.get(CGSettings.setCookieName);
		var images = _CG.images;
		
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
				
				var cookieGet = _CG.cookie.get(CGSettings.setCookieName);
				
				var thumbs = [];
				var bigImgs = [];
				var matchUrl = /thumb_|thumb/i;
				
				var tWidth = _CG.thumbs.width;
				var tHeight = _CG.thumbs.height;
				
				//return separatly the thumbs and big images
				for(var i = 0; i < cookieGet.length; i++){
					//get the thumbs and palce them in the list
					if(cookieGet[i].match(matchUrl)){
						thumbs.push(cookieGet[i]);
					}else{
						bigImgs.push(cookieGet[i]);
					}
				}
					var img;
				for(var x = 0; x < bigImgs.length; x++){
					img = bigImgs[x];
				}
				console.log(img);
				
				for(var i = 0; i < thumbs.length; i++){
					var liList = document.createElement('li');
					var replaceT = thumbs[i].replace(matchUrl, '');
					ci = true;
					
					liList.setAttribute('value', i);
					ulList.appendChild(liList);
					
					var id = liList.value;
					createThumb(id, liList, replaceT);

					liList.onclick = function(){
						console.log('click')
						createBigImg(img, imgIn, id);
					}
					
					
					if(i==0){createThumb(id, liList, replaceT)}
				}
				
			}
		}
	}

}
function createThumb(id, list, imgT){
	if(id){
		var createImg = document.createElement('img');
		createImg.id = id;
		createImg.setAttribute('width', _CG.thumbs.width);
		createImg.setAttribute('height', _CG.thumbs.height);
		
		//createImg.style.opacity = 0;
		//createImg.style.filter='alpha(opacity=0)';
		createImg.src = CGSettings.thumbdir + imgT;
		list.appendChild(createImg);
	}
}
function createBigImg(bigImg, holder, id){
	if(document.getElementById(id)){
		var createImg;
		createImg = document.createElement('img');
		createImg.src = CGSettings.imagesdir + bigImg;
		createImg.id = id;
		//createImg.style.display = 'none';
		holder.appendChild(createImg);
	}else{
		
	}
}


function fdin(i){
	if(i.complete){i.av=i.av+fs; i.style.opacity=i.av/100; i.style.filter='alpha(opacity='+i.av+')'}
	if(i.av>=100){if(auto){this.auto()}; clearInterval(i.timer); ci=i}
}
function fdout(i){
	i.av=i.av-fs; i.style.opacity=i.av/100;
	i.style.filter='alpha(opacity='+i.av+')';
	if(i.av<=0){clearInterval(i.timer); if(i.parentNode){i.parentNode.removeChild(i)}}
}
/*
GALL STRUCTURE

<div id="imgHolder">
	<div id="controlls"> Controlls: Reset | Pause | Save </div>
	<div id="imgIn">
		<div class="gallery-image">
			<img src="image">
		</div>
	</div>
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
