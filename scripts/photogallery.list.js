var buildList = function(){
	var _list = this,
		mainHolder = document.getElementById(CGSettings.placeTarget),
		cookieGet = _CG.cookie.get(CGSettings.setCookieName),
		returnedImages = _CG.imgString,
		thumbs = [],
		bigImgs = [],
		matchUrl = /\/thumbs/i,
		tWidth = _CG.thumbs.width,
		tHeight = _CG.thumbs.height,
		mObjs = [],
		noThumbsInView = 0,
		startIndex = 0;

	
	var speed = 300;
	var delay = 0;
	var ci;
	var ia;
	var auto = true;
	var autodelay = 5;
	var ie=document.all ? true : false;
	var setThumbA = 0;
	var value = 0;
	
	//calls the merged objects togheter
	//builds the HTML list
	//init the thumbs and imgs
	this.initList = function(){
		_list.splitCookies();
		_list.createDomElements();
		//merge the thumbs object with the big image obj
		_list.mergeObjs();
		
		var ulList = document.getElementById('listH');
		if(ulList){
			_list.storeUlWidth();
			_list.setThumbs(ulList);
			_list.selectImage(mObjs.id);
		}
		
	};
	//loops through cookie and splits the thumbs from big images
	//builds 2 arrays with new values
	this.splitCookies = function(){
		/* loop through images that are saved into the array
			separate the thumbs from big images
			build object with id, index src etc for each img
		*/
		for(var i = 0; i < returnedImages.length; i++){
			//separate thumbs
			if(returnedImages[i].match(matchUrl)){
				//build with object with new values for identifing
				thumbs.push(returnedImages[i])
			}else{
				bigImgs.push(returnedImages[i])			
			}
		}
	};
	//Holds only the HTML elements without actually images or thumbs
	this.createDomElements = function(){
		_list.createBigHolder();
		_list.creatContorls();
		_list.createThumbHolder();
	};
	//create the top part of the gal big image and controls
	this.createBigHolder = function(){
		var imgHolder = document.createElement('div'),
			gControl = document.createElement('div'),
			imgIn = document.createElement('div');
		
		imgHolder.setAttribute('id', 'imgHolder');
		imgIn.setAttribute('id', 'imgIn');
		gControl.setAttribute('id', 'controlls');

		mainHolder.appendChild(imgHolder);
		imgHolder.appendChild(imgIn);
		imgHolder.appendChild(gControl);
	};
	//create controls next prev and caption
	this.creatContorls = function(){
		var infoH = document.createElement('div'),
			prev = document.createElement('div'),
			photoName = document.createElement('div'),
			next = document.createElement('div');
		
		infoH.setAttribute('id', 'infoH');
		prev.setAttribute('id','prev');
		next.setAttribute('id','next');
		photoName.setAttribute('id','photName');

		mainHolder.appendChild(infoH);
		infoH.appendChild(prev);
		infoH.appendChild(photoName);
		infoH.appendChild(next);

		prev.innerHTML = 'Prev';
		next.innerHTML = 'Next';
	};
	//create holder of the thumbs
	this.createThumbHolder = function(){
		var thumbH = document.createElement('div'),
			ulList = document.createElement('ul');
		thumbH.setAttribute('id','thumbH');
		ulList.setAttribute('id', 'listH')
		mainHolder.appendChild(thumbH);
		thumbH.appendChild(ulList);
	};
	//function to create an object with detailed information
	//returns new object
    this.addImageToGallery = function(imageConfig){
        imageConfig  = {
            index : imageConfig.index,
            id : imageConfig.id,
            thumb : imageConfig.thumb,
            caption : imageConfig.caption,
            src : imageConfig.src
        };
		return imageConfig;
    };
	//once we split the cookie push into new object just the thumbs
	//returns new object
	this.setThumbObj = function(){
		var objThumb = [];
		for(var x = 0; x < thumbs.length; x++){
			objThumb.push(
				_list.addImageToGallery({
					index : x,
					id : x,
					thumb : thumbs[x],
					caption : 'title',
					src : thumbs[x]
				})			
			)		
		}
		return objThumb;
	};
	//once we split the cookie push into new object just the big images
	//returns new object
	this.setImgObj = function(){
		var objImg = [];
		for(var x = 0; x < bigImgs.length; x++){
			objImg.push(
				_list.addImageToGallery({
					index : x,
					id : x,
					thumb : bigImgs[x],
					caption : 'title',
					src : bigImgs[x]
				})			
			)		
		}
		return objImg;
	};
	//setThumbObj and setImgObj merged togheter for haveing single id or index for the same thumb and img
	//returns new object
	this.mergeObjs = function(){
		var objThumb = _list.setThumbObj();
		var objImgs = _list.setImgObj();
		for(var p in objThumb){
			for(var o in objImgs){
				mObjs[p] = {
					index : objThumb[p].index,
					id : objThumb[p].id,
					thumb : objThumb[p].thumb,
					caption : 'title',
					src : objImgs[p].src
				}
			}
		}
		return mObjs;
	};
	//once the object thubms it's set apply id and value for identifing the images
	this.setThumbs = function(ulHolder){
		var x = 0, max = mObjs.length,
			id = 0, index = 0,
			thumb = '';
			
		for(x; x < max; x++){
			var liList = document.createElement('li');
				id = mObjs[x].id;
				index  = mObjs[x].index;
				thumbSrc = mObjs[x].thumb;
			
			liList.setAttribute('value', index);
			ulHolder.appendChild(liList);
			
			//create thumb images and append them to each li
			_list.createImgThumb(id, liList, thumbSrc);
			
			/*
			//on click switch the big image assigned to thumb
			liList.onclick = function(e){
				id = this.getAttribute('value');
				//_list.createBigImg(imgIn, value, bigImgs[value]);
			}
			if(x == 0){
				//_list.createBigImg(imgIn, id, objImg[id]);
			}*/
		};
		
		
	}
	//create thumbs annd apend them
	this.createImgThumb = function(id, list, thumbSrc){
		if(id != null || id != ''){
			var createT = document.createElement('img');
			createT.id = 'thumb_' + id;
			createT.setAttribute('width', _CG.thumbs.width);
			createT.setAttribute('height', _CG.thumbs.height);
			createT.src = thumbSrc;
			list.appendChild(createT);
		}
	};
	this.storeUlWidth = function(){
		var containerWidth = document.getElementById('thumbH').offsetWidth;
		var ulWidth = document.getElementById('listH');
		var setW = (ulWidth.style.width = Math.round(containerWidth * mObjs.length) + 'px');
		return setW;
	}
	this.selectImage = function(id) {
        if(id == mObjs.index) {
            //return;
        }
		_list.highlightAndMoveThumbnailIntoView();

    }
    this.getIndexPositionOfHighlightDiv = function () {
        var posHighlight = document.id(this.dom.thumbnailHighlight).getStyle('left').replace('px', '') / 1;
        return Math.round(posHighlight / this.thumbs.width);
    }
    this.getIndexPositionOfActiveThumbnail = function () {

        var pos = document.id(this.dom.activeEnlargedImage.id).getStyle('left').replace('px', '') / 1 + this.dom.thumbnailContainer.getStyle('left').replace('px', '') / 1;
        return Math.round(pos / this.thumbs.width);
    }
    this.highlightAndMoveThumbnailIntoView = function () {

        var indexHighlight = this.getIndexPositionOfHighlightDiv();
        var indexThumb = this.getIndexPositionOfActiveThumbnail();

        var newPosStrip = this.dom.thumbnailContainer.getStyle('left');
        var newPosHighlight = indexThumb * this.thumbs.width;

        if (this.isLocatedAtFirstImageInSlideshow()) {
            newIndexHighlight = 0;
        } else if (this.isLocatedAtLastImageInSlideshow()) {
            newIndexHighlight = Math.min(this.thumbs.noThumbsInView - 1, this.images.length - 1);
        }
        else if (this.isLocatedBeyondRightEdgeOfView()) {
            newIndexHighlight = this.thumbs.noThumbsInView - 1;
        }
        else if (this.isLocatedAtLastThumbnailInView()) {
            newIndexHighlight = Math.min(this.thumbs.noThumbsInView - 1, indexThumb - 1);
        }
        else if (this.isLocatedAtFirstThumbnailInView()) {
            newIndexHighlight = 1;
        }
        else {
            newIndexHighlight = indexThumb;
        }


        newPosHighlight = newIndexHighlight * this.thumbs.width;
        newPosStrip = (0 - this.getCurrentIndex() + newIndexHighlight) * this.thumbs.width

        var myFx = new Fx.Tween(this.dom.thumbnailHighlight);
        myFx.start('left', this.dom.thumbnailHighlight.getStyle('left'), newPosHighlight);

        var myFx = new Fx.Tween(this.dom.thumbnailContainer);
        myFx.start('left', this.dom.thumbnailContainer.getStyle('left'), newPosStrip);

    }


	/*
	//add big image to the given id
	this.createBigImg = function(holder, id, bigImgs){
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
							_list.fdout(o)
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
				//clearTimeout(createImg.timer);
			}
			createImg.timer = setInterval(function(){
				_list.fdin(createImg);
			}, _CG.autoplay.fadeduration);
	
		}
	};
	this.fdin = function(image){
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
	};
	this.fdout = function(image){
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
	this.setup = function(){
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
			getCWidth = slides[x].offsetWidth;
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
		_list.slide(index, 0, ulList, slides);
		_list.begin(next, prev);

	};
	this.slide = function(index, duration, ulList, liList) {
		var style = ulList.style,
			liListW;
			
		for(var x = 0; x < liList.length; x++){
			liListW = liList[x].offsetWidth;
		}
		
		style.webkitTransitionDuration = style.MozTransitionDuration = speed + 'ms';
		style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
		
		ulList.onmouseover = function(evnt){
			//_list.onHoverStart(evnt, ulList, index, liListW, liList);
		}
	};	
	this.begin = function(nextB, prevB) {
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0],
			slides = ulList.children,
			index = 0,
			liListW,
			moveRight = 0,
			moveLeft = 0,
			setActive = -1;
		
		thumbH.width = thumbH.getBoundingClientRect().width;
		
		for(var x = 0; x < slides.length; x++){
			liListW = slides[x].offsetWidth;
			slides[x].style.width = liListW + 'px';
		}
		var getMaxScroll = (liListW * slides.length) - thumbH.width;
		
		//make auto scroll
		ulList.timer = setInterval(function(){
			moveRight += liListW;
			if(moveRight >= getMaxScroll){
				moveRight = 0;
				nextT(index, slides, moveRight);
			}else{
				nextT(index, slides, moveRight);
			}
		}, _CG.autoplay.autorotate.duration)

		//on click go to next slide
		nextB.onclick = function(){
			_list.nextT(index, slides);
			
			//moveRight += liListW;
			if(moveRight >= getMaxScroll){
				moveRight = 0;
				_list.nextT(index, slides, moveRight, setActive);
			}else{
				_list.nextT(index, slides, moveRight, setActive);
			}
		}	
		prevB.onclick = function(){}	
		
	};	
	this.onHoverStart = function(e, ulList, index, width, liList) {
		var deltaX = _list.getPosition(thumbH);
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
	};
	this.nextT = function(index, list){
		setThumbA = _list.getCurrentIndex() + 1;
		
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0],
			liChild = listH.getElementsByTagName('li');
			
		if(setThumbA === liChild.length){
			setThumbA = 0;
		}
		_list.getIdByIndex(setThumbA);
		
		
		
		
		
		 
		for(var x = 0; x < liChild.length; x++){
			if(setActive){
				liChild[0 + setActive].style.opacity = '1';
			}else if(setActive === liChild.length){
				setActive = 0;
			}
		}
		
		/*if(index < list.length - 1){
			ulList.style.left = -(moveRight) + 'px';
		}else{
			ulList.style.left =  (moveRight) + 'px';
		}
		
	};
	this.prevT = function(index, list, moveLeft){
		var thumbH = document.getElementById('thumbH'),
			ulList = thumbH.getElementsByTagName('ul')[0];
		ulList.style.left = (moveLeft) + 'px';
	};
	this.highlightT = function(element){
		element.setAttribute('class', 'active');
	};
	//get element coordinates for hover left right of thumbs
	this.getPosition = function(element) {
		var xPosition = 0;
		var yPosition = 0;
		while(element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	}
    this.getCurrentIndex = function (){
        return _CG.startIndex;
    };
    this.getIdByIndex = function(index) {
		console.log(thumbs)
        return thumbs.id;
    };
    this.getImageDataById = function (id) {
        var countImages = this.images.length;
        for (var i = 0; i < countImages; i++) {
            if (this.images[i].id == id) {
                return this.images[i];
            }
        }
    }*/
		
	if(CGSettings.placeTarget != ''){
		if(mainHolder){
			if(doneLoading === true){
				_list.initList();
			}
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
