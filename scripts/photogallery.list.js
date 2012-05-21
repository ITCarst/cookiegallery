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
				
				var returnedImages = _CG.imgString;
				var thumbs = [];
				var bigImgs = [];
				var matchUrl = /\/thumbs/i;
				
				var tWidth = _CG.thumbs.width;
				var tHeight = _CG.thumbs.height;
				
				//return separatly the thumbs and big images
				for(var i = 0; i < returnedImages.length; i++){
					//get the thumbs and palce them in the list
					if(returnedImages[i].match(matchUrl)){
						thumbs.push(returnedImages[i]);
					}else{
						bigImgs.push(returnedImages[i]);
					}
				}
				
				for(var x = 0, max = thumbs.length; x < max; x++){
					var liList = document.createElement('li');

					liList.setAttribute('value', x);
					ulList.appendChild(liList);
					
					var id = liList.value;
					createThumb(id, liList, thumbs[x]);
					
					var value = 0;
					liList.onclick = function(e){
						var value = this.getAttribute('value');
						createBigImg(imgIn, value, bigImgs[value]);
					}
					if(x == 0){
						createBigImg(imgIn, value, bigImgs[value]);
					}
				}
			}
		}
	}
}

var ci;
var ia;
var auto = true;
var autodelay = 5;

//ia = document.getElementById(imgid);

//create thumbs annd apend them
function createThumb(id, list, thumbI){
	if(id != null){
		var createT = document.createElement('img');
		createT.id = 'thumb_'+id;
		createT.setAttribute('width', _CG.thumbs.width);
		createT.setAttribute('height', _CG.thumbs.height);
		createT.src = thumbI;
		list.appendChild(createT);
	}
}
//add big image to the given id
function createBigImg(holder, id, bigImgs){
	
	if(id != null){
		
		var foundId = document.getElementById(id),
			createImg;
		
		if(ci != null){
			var ts,
				tsl,
				x;
			ts = holder.getElementsByTagName('img');
			tsl = ts.length;
			x=0;
			
			for(x; x < tsl; x++){
				if(ci.id!=id){
					var o = ts[x];
					clearInterval(o.timer);
					o.timer = setInterval(function(){
						fdout(o)
					},_CG.autoplay.fadeduration)}
			}
		}

			
		//if the holder has no image then create the first image	
		if(!foundId){
			createImg = document.createElement('img');
			createImg.src = bigImgs;
			createImg.id = id;
			createImg.av = 0;
			createImg.style.opacity = 0;
			createImg.style.filter = 'alpha(opacity=0)';
			holder.appendChild(createImg);
			
		}else{
			createImg = document.getElementById(id);
			clearInterval(createImg.timer);
		}

		if(auto){
			console.log(auto);
			clearTimeout(createImg.timer);
		}
		createImg.timer = setInterval(function(){
			fdin(createImg);
		}, _CG.autoplay.fadeduration);

	}
}
function fdin(image){
	if(image.complete){
		image.av = image.av + _CG.autoplay.fadeduration;
		image.style.opacity = image.av / 100;
		image.style.filter = 'alpha(opacity=' + image.av + ')';
	}
	if(image.av >= 100){
		image.style.opacity = 1;
		image.style.filter = 'alpha(opacity=100)';

		if(auto){
			//autoF(image);
			console.log('auto')
		};
		clearInterval(image.timer);
		ci = image;
	}

	
}
function fdout(image){
	image.av = image.av - _CG.autoplay.fadeduration;
	image.style.opacity = image.av / 100;
	image.style.filter = 'alpha(opacity=' + image.av + ')';
	
	if(image.av <= 0){
		clearInterval(image.timer);
		
		if(image.parentNode){
			image.parentNode.removeChild(image)
		}
		
	}
	
	
}
function autoF(image){
	image.timer = setInterval(function(){
		nav(1);
		console.log('test')
	}, autodelay * 1000)
}

function nav(d){

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
