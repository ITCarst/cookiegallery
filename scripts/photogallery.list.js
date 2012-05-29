function buildList(){
	var _list = this;
	
	if(CGSettings.placeTarget != ''){
		var cookieGet = _CG.cookie.get(CGSettings.setCookieName);
		var images = _CG.images;
		var mainHolder = document.getElementById(CGSettings.placeTarget);
		
		if(mainHolder){
			if(doneLoading === true){
				buildHTML();
			}
		}
	}
}
function buildHTML(){
	var mainHolder = document.getElementById(CGSettings.placeTarget);
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
	ulList.setAttribute('id', 'listH')
	
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
	prev.innerHTML = 'Prev';
	next.innerHTML = 'Next';
	setup();
}

var speed = 300;
var delay = 0;

function setup(){
	var thumbH = document.getElementById('thumbH'),
		ulList = document.getElementById('listH'),
		slides = ulList.getElementsByTagName('li'),
		length = slides.length,
		index = length,
		getCWidth,
		el;
	
    // return immediately if their are less than two slides
    if(length < 2) return null;

	// hide slider element but keep positioning during setup
    thumbH.style.visiblilty = 'hidden';
    thumbH.width = thumbH.getBoundingClientRect().width;

	if(!thumbH.width) return null;
	
	for(var x = 0; x < slides.length; x++){
		getCWidth = slides[x].offsetWidth + 10;
	}
	// dynamic css
    ulList.style.width = (length * getCWidth) + 'px';
	
	//set width to each li
    while(index--) {
		el = slides[index];
    }
	//if the width has been set then show the ul
	if(ulList.style.width){
		thumbH.style.visiblilty = 'visible';
	}
    slide(index, 0, ulList, slides);
	
	begin(next, prev);

	
}
function slide(index, duration, ulList, liList) {
    var style = ulList.style,
		liListW;
		
	for(var x = 0; x < liList.length; x++){
		liListW = liList[x].offsetWidth + 15;
	}
	
    style.webkitTransitionDuration = style.MozTransitionDuration = speed + 'ms';
	style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
	
	ulList.onmouseover = function(evnt){
		onHoverStart(evnt, ulList, index, liListW, liList);
	}
}

function onHoverStart(e, ulList, index, width, liList) {
	var deltaX = getPosition(thumbH);
	var scrollX;
	deltaX = e.pageX - deltaX.x;

	//user starts to scroll right
	if(deltaX > width){
		deltaX = deltaX / 1;
		scrollX = - (deltaX - index * width) + 'px';
	}else if(deltaX <= width){
		deltaX = 0;
		scrollX = - (deltaX - index) + 'px';
	}
	ulList.style.left = scrollX;
}

function nextT(index, list, moveRight){
	var thumbH = document.getElementById('thumbH'),
		ulList = thumbH.getElementsByTagName('ul')[0];
	
	if(index < list.length - 1){
		ulList.style.left = -(moveRight) + 'px';
	}else{
		ulList.style.left =  (moveRight) + 'px';
	}
	
}
function prevT(index, list, moveLeft){
	var thumbH = document.getElementById('thumbH'),
		ulList = thumbH.getElementsByTagName('ul')[0];
    
	ulList.style.left = (moveLeft) + 'px';
}


function begin(nextB, prevB) {
	var thumbH = document.getElementById('thumbH'),
		ulList = thumbH.getElementsByTagName('ul')[0],
		slides = ulList.children,
		index = 0,
		liListW,
		moveRight = 0,
		moveLeft = 0;
	
	thumbH.width = thumbH.getBoundingClientRect().width;
	
	for(var x = 0; x < slides.length; x++){
		liListW = slides[x].offsetWidth;
		slides[x].style.width = liListW + 'px';
	}
	
	var getMaxScroll = (liListW * slides.length) - thumbH.width;
	
	//make auto scroll
	ulList.timer = setInterval(function(){
		/*moveRight += liListW;
		if(moveRight >= getMaxScroll){
			moveRight = 0;
			nextT(index, slides, moveRight);
		}else{
			nextT(index, slides, moveRight);
		}*/
	}, _CG.autoplay.autorotate.duration)

	//on click go to next slide
	nextB.onclick = function(){
		moveRight += liListW;
		if(moveRight >= getMaxScroll){
			moveRight = 0;
			nextT(index, slides, moveRight);
		}else{
			nextT(index, slides, moveRight);
		}
	}	

	prevB.onclick = function(){
		moveLeft += liListW;
		
		if(moveRight <= 0){
			moveLeft = 0;
			prevT(index, slides, moveLeft);
		}else{
			moveLeft -= moveRight;
			console.log('move left' + moveLeft);
			console.log('move right ' + moveRight)
			prevT(index, slides, moveLeft);
		}
		
	}	

}


function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;
	 
	while(element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
}

var ci;
var ia;
var auto = true;
var autodelay = 5;
var ie=document.all ? true : false;
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
