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
var fs = 0.5;

function createThumb(id, list, thumbI){
	if(id != null){
		var createImg = document.createElement('img');
		createImg.id = 'thumb_'+id;
		createImg.setAttribute('width', _CG.thumbs.width);
		createImg.setAttribute('height', _CG.thumbs.height);
		createImg.src = thumbI;
		list.appendChild(createImg);
	}
}
function createBigImg(holder, id, bigImgs){
	if(id != null){
		var foundId = document.getElementById(id),
			createImg;
		
		if(!foundId){
			createImg = document.createElement('img');
			createImg.src = bigImgs;
			createImg.id = id;
			createImg.av = 0;
			createImg.style.opacity = 0;
			createImg.style.filter = 'alpha(opacity=0)';
			holder.appendChild(createImg);
			
		}else{
			var ts,
				tsl,
				x;
			ts = holder.getElementsByTagName('img');
			tsl = ts.length;
			x = 0;
			
			for(x; x < tsl; x++){
				
				console.log(tsl[x])
				
				if(createImg.id != id){
					var o = ts[x];
					clearInterval(o.timer);
					o.timer=setInterval(function(){
						fdout(o)
					},fs)
				}
			}
		}
		createImg.timer = setInterval(function(){fdin(createImg)},fs);
	}
}
function fdin(i){
	if(i.complete){
		i.av = i.av + fs;
		i.style.opacity = i.av / 100;
		i.style.filter = 'alpha(opacity='+i.av+')';
		console.log(i)
	}
	if(i.av >= 100){
		console.log('goes here')
		i.style.opacity = 1;
		i.style.filter = 'alpha(opacity=100)';
		clearInterval(i.timer); ci=i
	}
}
function fdout(i){
	i.av = i.av-fs;
	i.style.opacity = i.av / 100;
	i.style.filter = 'alpha(opacity='+i.av+')';
	
	if(i.av <= 0){
		clearInterval(i.timer);
		if(i.parentNode){
			i.parentNode.removeChild(i)
		}
	}
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
