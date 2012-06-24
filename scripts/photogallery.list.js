/* TO DO
	DONE * Make this entire object private
	DONE * NEXT ---- on click switch big image and thumb
	DONE * PREV ---- on click swith big image and thumb
	DONE * Thumb click --- get correct image
	DONE * highlight once gets out of the view scroll to the right position
		DONE * need to get the position of active thumb
		DONE * on movement create animation effect
	DONE * make auto animation to switch big image and thumb
	DONE * on the next or prev click reset the time to _CG duration so the animation will be interupted on click
	DONE * fix the fade in and fade out effects of the big images
	DONE * Create pause btn --- will stop the animation
	DONE * create play btn -- will resume the animation
	DONE * Build REST the slide animation from start with data from cookie
	DONE * Save - stops the scrolling animation and saves in cookies
		* need to set by default in cookies active witch at the beginning will be 0
		* once the slider starts to move on save btn press that position needs to be updated and saved into the cookie with the new active value
		* on page refresh the slider has to start from the saved position
	* remove button - will remove the current image and thumb including from the cookies
		* get the li big image and thumb and remove them based on the mObj.id
		* get the cookies remove the current image from it
		* set it again with the new values
    DONE * Each action of SAVE | REMOVE | RESET must show a popup with confirmation	
	* BUG ON MOVE RIGHT
	DONE * When cookies are set the list it's build but the cookies are not loaded and split it shows the html but not the cookies from images
	* CAPTION object add image title not hardcoded text
	* INTERNET EXPLOERE SUPORT	
	* check for _CG settings of the buttons if they are disabled enabled etc.	
	* to fix the move into highlight logic

	EXTRA
	* Create horizontal gallery with option
	* create an visual line ofer the image to show "time" when the image it's swithing
	
	
	OLDER ONES
	DONE * on thumb click we call a function which creates the first image on x = 0
	DONE * but when click on the thumb the image calls the thumbclick fn which returns an index --- this index it's not returning correct data
	DONE * for next click needs to increase + 1
	DONE * on prev click needs to decrease -1
	DONE * on thumb click needs to select the big image based on the returing id 
  
*/
_CG.buildList = function(){
	var _list = this,
		mainHolder = document.getElementById(CGSettings.placeTarget),
		cookieGet = _CG.cookie.get(CGSettings.setCookieName),
		getCActive = _CG.cookie.getCActive() || _CG.isActive, //get the number of active from cookie
		thumbs = [],
		bigImgs = [],
		mObjs = [],
		speed = 300,
		countImage,
		noThumbsInView = 0,
		doReset = false,
		getNew = 0;
		
		
	//calls the merged objects togheter
	//builds the HTML list
	//init the thumbs and imgs
	var initList = function(){
		//split _thumbs cookie from big img cokoie
		splitCookies();
		//create all html holders
		createDomElements();
		//merge the thumbs object with the big image obj
		mergeObjs();
		
		var listH = document.getElementById('listH');
		
		if(listH){
			storeThumbsInView();
			//add dynamic width to the ul
			storeUlWidth(listH);
			//create the li with img and append them to ul
			setThumbs(listH);
			
			//if the autoplay is true do autorotate
			if(_CG.autoplay.enabled){
				startAutoPlay(listH, _CG.autoplay.autorotate.duration);
			}
			/*
			listH.onmousemove = function(evnt){
				//stopAnimation();
				//onHoverStart(evnt, listH);
			}
			listH.onmouseout = function(){
				//resetAutoPlayOnClick();
			}*/
			
		}
	};
	//loops through cookie and splits the thumbs from big images
	//builds 2 arrays with new values
	var splitCookies = function(){
		/* loop through images that are saved into the cookies
			separate the thumbs from big images
			build object with id, index src etc for each img for further linking
		*/
		var matchUrl = /thumb_/i;
		for(var i = 0; i < cookieGet.length; i++){
			//separate thumbs
			if(cookieGet[i].match(matchUrl)){
				var stripname = cookieGet[i].replace(matchUrl, '');
				thumbs.push(CGSettings.thumbdir + stripname);
			}else{
				bigImgs.push(CGSettings.imagesdir + cookieGet[i])			
			}
		}
	};
	//Holds only the HTML elements without actually images or thumbs
	var createDomElements = function(){
		createBigHolder();
		creatContorls();
		createThumbHolder();
		clickActions();
	};
	//create the top part of the gal big image and controls
	var createBigHolder = function(){
		var imgHolder = document.createElement('div'),
			gControl = document.createElement('div'),
			cHolders = document.createElement('div'),
			imgIn = document.createElement('div'),
			start = document.createElement('div'),
			stop = document.createElement('div'),
			remove = document.createElement('div'),
			reset = document.createElement('div');
			save = document.createElement('div');
			
		imgHolder.setAttribute('id', 'imgHolder');
		imgIn.setAttribute('id', 'imgIn');
		gControl.setAttribute('id', 'controls');
		cHolders.setAttribute('id', 'contorlHolders');
		
		start.setAttribute('id', 'play');
		stop.setAttribute('id', 'stop');
		remove.setAttribute('id', 'remove');
		reset.setAttribute('id', 'reset');
		save.setAttribute('id', 'save');

		start.setAttribute('class', 'actionControls');
		stop.setAttribute('class', 'actionControls');
		remove.setAttribute('class', 'actionControls');
		reset.setAttribute('class', 'actionControls');
		save.setAttribute('class', 'actionControls');

		mainHolder.appendChild(imgHolder);
		imgHolder.appendChild(imgIn);
		imgHolder.appendChild(gControl);
		gControl.appendChild(cHolders);
		
		cHolders.appendChild(start);
		cHolders.appendChild(stop);
		cHolders.appendChild(remove);
		cHolders.appendChild(reset);
		cHolders.appendChild(save);
		
	};
	//create controls next prev and caption
	var creatContorls = function(){
		var infoH = document.createElement('div'),
			prev = document.createElement('div'),
			photoCaption = document.createElement('div'),
			next = document.createElement('div');
		
		infoH.setAttribute('id', 'infoH');
		prev.setAttribute('id','prev');
		next.setAttribute('id','next');
		prev.setAttribute('class', 'moveControls');
		next.setAttribute('class', 'moveControls');
		photoCaption.setAttribute('id','photoCaption');
		mainHolder.appendChild(infoH);
		infoH.appendChild(prev);
		infoH.appendChild(next);
		infoH.appendChild(photoCaption);
		
	};
	//create holder of the thumbs
	var createThumbHolder = function(){
		var thumbH = document.createElement('div'),
			ulList = document.createElement('ul');
		thumbH.setAttribute('id','thumbH');
		ulList.setAttribute('id', 'listH')
		mainHolder.appendChild(thumbH);
		thumbH.appendChild(ulList);
	};
	
	//get all the buttons which has action and apply the click event on them
	//each one calls it's functionality functions
	var clickActions = function(){
		var playBtn = document.getElementById('play'),
			stopBtn = document.getElementById('stop'),
			nextBtn = document.getElementById('next'),
			prevBtn = document.getElementById('prev'),
			removeBtn = document.getElementById('remove'),
			resetBtn = document.getElementById('reset'),
			saveBtn = document.getElementById('save');
			
		if(playBtn && stopBtn){
			playBtn.onclick = function(){
				resetAutoPlayOnClick();
			}
			stopBtn.onclick = function(){
				stopAnimation();
			}
			removeBtn.onclick = function(){
				removeCurrent();
			}
			resetBtn.onclick = function(){
				resetAnimation();
			}
			saveBtn.onclick = function(){
				var stringAction = 'Save';
				saveCurrent(stringAction);
			}
		}
		if(nextBtn && prevBtn){
			//move slider to right
			nextBtn.onclick = function(){
				resetAutoPlayOnClick();
				moveRight();
			}
			//move slider to left
			prevBtn.onclick = function(){
				resetAutoPlayOnClick();
				moveLeft();
			}
		}		
	}
	//function to create an object with detailed information
	//returns new object
    var addImageToGallery = function(imageConfig){
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
	var setThumbObj = function(){
		var objThumb = [];
		for(var x = 0; x < thumbs.length; x++){
			objThumb.push(
				addImageToGallery({
					index : x,
					id : x,
					thumb : thumbs[x],
					caption : thumbs[x],
					src : thumbs[x]
				})			
			)		
		}
		//console.log(objThumb)
		return objThumb;
	};
	//once we split the cookie push into new object just the big images
	//returns new object
	var setImgObj = function(){
		var objImg = [];
		for(var x = 0; x < bigImgs.length; x++){
			objImg.push(
				addImageToGallery({
					index : x,
					id : x,
					thumb : bigImgs[x],
					caption : bigImgs[x],
					src : bigImgs[x]
				})			
			)		
		}
		return objImg;
	};
	//setThumbObj and setImgObj merged togheter for haveing single id or index for the same thumb and img
	//returns new object
	var mergeObjs = function(){
		var objThumb = setThumbObj();
		var objImgs = setImgObj();
		for(var p in objThumb){
			for(var o in objImgs){
				mObjs[p] = {
					index : objThumb[p].index,
					id : objThumb[p].id,
					thumb : objThumb[p].thumb,
					caption : objThumb[p].thumb,
					src : objImgs[p].src
				}
			}
		}
		//console.log(mObjs)
		return mObjs;
	};
	//get the thumb holder width and devided by the thumb width
	//return the number of the thumbs that can be visible into thumb holder
	var storeThumbsInView = function(){
		var thumbH = document.getElementById('thumbH');
        var containerWidth = thumbH.offsetWidth;
        noThumbsInView = Math.round(containerWidth / _CG.thumbs.width);
	};
	//set width to the ul imgs.length * the thumb width	
	var storeUlWidth = function(ulH){
		var setW = (ulH.style.width = Math.round(mObjs.length * (_CG.thumbs.width + 4)) + 'px');
		return setW;
	};
	//once the object thubms it's set apply id and value for identifing the images
	var setThumbs = function(ulHolder){
		var x = 0, max = mObjs.length, id = 0, index = 0;
		var imgH = document.getElementById('imgIn');
		var photoCaption = document.getElementById('photoCaption');
		
		for(x; x < max; x++){
			var liList = document.createElement('li');
				id = mObjs[x].id;
				index  = mObjs[x].index;
				thumbSrc = mObjs[x].thumb,
				bigSrc = mObjs[x].src,
				matchSrc = thumbSrc.match(CGSettings.thumbdir),
				replaceSrc = thumbSrc.replace(matchSrc, ''), //replace the images path
				matchExt = replaceSrc.match(CGSettings.fileTypes), //match extensions
				rmvExtension = replaceSrc.replace(matchExt, ''); //replace extensions and get only the image name and apply id to the img thumbs
				
			liList.setAttribute('id', 'list_' + id);
			ulHolder.appendChild(liList);
 			
			//create thumb images and append them to each li
			createImgThumb(rmvExtension, liList, thumbSrc);
			
			//on click switch the big image assigned to thumb
			liList.onclick = function(e){
				resetAutoPlayOnClick();
				clickOnThumbnail(e);
			}
			if(x == getCActive){
				if(liList.hasAttribute('id', 'list_' + getCActive)){
					liList.setAttribute('class', 'active');
					createBigImg(getCActive, imgH);
					photoCaption.innerHTML = mObjs[id].caption;
				}
			}
		};
	}
	//create thumbs annd apend them
	var createImgThumb = function(id, list, thumbSrc){
		if(id != null || id != ''){
			var createT = document.createElement('img');
			createT.setAttribute('id','thumb_' + id);
			createT.setAttribute('width', _CG.thumbs.width);
			createT.setAttribute('height', _CG.thumbs.height);
			createT.src = thumbSrc;
			list.appendChild(createT);
		}
	};
	var createBigImg = function(id, holder){
		if(id != null){
			var foundId = document.getElementById('img_' + id),
				createImg;
			//first time the count image is null
			//but when the image is set the countImage gets the image
			if(countImage != null){
				var getImages = holder.getElementsByTagName('img'),
					imgeLength = getImages.length,
					x = 0;
					
				//loop through holder images and match the id with the found id
				for(x; x < imgeLength; x++){
					if(countImage.id != id){
						var setOpacity = getImages[x];
						clearInterval(setOpacity.timer);
						setOpacity.timer = setInterval(function(){
							fdout(setOpacity);
						},_CG.autoplay.fadeduration)
					}
				}
			}
			//if the holder has no image then create the first image	
			if(!foundId){
				createImg = document.createElement('img');
				createImg.src = mObjs[id].src;
				createImg.id = 'img_' + mObjs[id].id;
				createImg.setOpacity = 0;
				createImg.style.opacity = 0;
				createImg.style.filter = 'alpha(opacity=0)';
				holder.appendChild(createImg);
			}else{
				createImg = document.getElementById('img_' + id);
				clearInterval(createImg.timer);
			}
			
			createImg.timer = setInterval(function(){
				fdin(createImg);
			}, _CG.autoplay.fadeduration);
	
		}		
	};
	//fade in the big image
	var fdin = function(image){
		//check if image has been loaded and set opacity based on the interval increases
		if(image.complete){
			image.setOpacity = image.setOpacity + _CG.autoplay.fadeduration;
			image.style.opacity = image.setOpacity / 100;
			image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		}
		//once the image visibility reaches 100 then set opacity to 1
		if(image.setOpacity >= 100){
			image.style.opacity = 1;
			image.style.filter = 'alpha(opacity=100)';
			clearInterval(image.timer);
			countImage = image;
		}
	};
	//fade out the big image
	var fdout = function(image){
		image.setOpacity = image.setOpacity - _CG.autoplay.fadeduration;
		image.style.opacity = image.setOpacity / 100;
		image.style.filter = 'alpha(opacity=' + image.setOpacity + ')';
		
		if(image.setOpacity <= 0){
			clearInterval(image.timer);
			if(image.parentNode){
				image.parentNode.removeChild(image);
			}
		}
	};	
	//general function witch gets the all objects but returns just the object with the machted id
    var getImageDataById = function(id) {
        var countImages = mObjs.length;
        for (var i = 0; i < countImages; i++) {
            if (mObjs[i].id == id) {
                return mObjs[i];
            }
        }
    };
	//on thumbnail click get target id and replace the string convert it into number
	//then send the given id to the selectImage fn
	var clickOnThumbnail = function(e) {
		var getTargetId = e.target.parentNode.id;
		var getId = getTargetId.replace('list_', '');
		var id = Number(getId);
		//update the startPos with the new id
		_CG.isActive = id;
		selectImage(id);
    };
	//moves the slider to right
	//if reaches the max length of the images starts from 0
	var moveRight = function(ulList){
		if(getCActive >= _CG.isActive){
			_CG.isActive = getCActive;
		}
		_CG.isActive = _CG.isActive + 1;
		if(_CG.isActive >= mObjs.length) {
            _CG.isActive = 0;
        }
		selectImage(mObjs[_CG.isActive].id);
	};
	//moves slider to left
	//if gets under 0 then start from the end position of the given images object
	var moveLeft = function(){
		_CG.isActive = _CG.isActive - 1;
		if(_CG.isActive < 0){
			_CG.isActive = mObjs.length - 1;
		}
		selectImage(mObjs[_CG.isActive].id);
	};
	//sects active class to the li
	//and if it already exists then removes the active and gives it to the next li
	var createThumbHighLight = function(id){
		var imageData = getImageDataById(id);
		for(var x = 0; x < mObjs.length; x++){
			var getList = document.getElementById('list_' + mObjs[x].id);
			if(mObjs[x].id == id){
				getList.setAttribute('class', 'active');
			}else{
				//if(getList.hasAttribute('class', 'active')){
				if(getList.className == 'active'){
					getList.removeAttribute('class', 'active');
				}
			}
		}
	}
	var moveHighilightIntoView = function(id){
		var newIndexHighlight;
		var listH = document.getElementById('listH');		
		var activeLi = getActiveEl(listH);
		
		//start position is 0
		if(activeLi == 0) {
			newIndexHighlight = 0;
		//start from end position
		}else if(activeLi == (mObjs.length - 1)) {
			var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
			newIndexHighlight = -(getLast * _CG.thumbs.width);
		//if active bigger then thumbs move to right e.g. 6=6
		}else if(activeLi > noThumbsInView) {
			newIndexHighlight = - (noThumbsInView - 1) * _CG.thumbs.width;
		//if active bigger = to thumbs move right 6 >5  
		}else if(activeLi >= (noThumbsInView - 1)) {
			var getNew = Math.min(noThumbsInView - 1, _CG.isActive - 1);
			newIndexHighlight = - (getNew * _CG.thumbs.width);
		}else if(activeLi <= 0) {
			newIndexHighlight = 1;
		}else {
			newIndexHighlight = _CG.isActive;
		}    
		listH.style.webkitTransitionDuration = listH.style.MozTransitionDuration = speed + 'ms';
		listH.style.msTransitionDuration = listH.style.OTransitionDuration = speed + 'ms';
		listH.style.transitionDuration = speed + 'ms';
		
		
		listH.style.left = newIndexHighlight + 'px';
		/*//start position is 0
		if(activeLi == 0) {
            newIndexHighlight = 0;
			getNew = 0;
		//start from end position
        }else if(activeLi == (mObjs.length - 1)) {
			var getLast = Math.min(noThumbsInView -1, mObjs.length - 1);
			newIndexHighlight = - (getLast * _CG.thumbs.width);
		//if active bigger then thumbs move to right e.g. 6=6
        }else if(activeLi > noThumbsInView) {
            newIndexHighlight = - (noThumbsInView - 1) * _CG.thumbs.width;
		//if active bigger = to thumbs move right 6 >5	
        }else if(activeLi >= (noThumbsInView - 1)) {
			//var getNew = Math.min(noThumbsInView - 1, startPos - 1);
            //newIndexHighlight = - (getNew * _CG.thumbs.width);
			if(getNew == 0){
				getNew = _CG.thumbs.width;
			}else {
				getNew += getNew;
			}
			newIndexHighlight = - getNew;
        }else if(activeLi <= 0) {
            newIndexHighlight = 1;
        }else {
			getNew = 0;
            newIndexHighlight = 0;
        }		
		listH.style.webkitTransitionDuration = listH.style.MozTransitionDuration = speed + 'ms';
		listH.style.msTransitionDuration = listH.style.OTransitionDuration = speed + 'ms';
		listH.style.transitionDuration = speed + 'ms';
		
		listH.style.left = newIndexHighlight + 'px';*/
		
	};
	//returns the id of the active li elem
	var getActiveEl = function(listH){
		var getLi = listH.getElementsByTagName('li');
		var foundActive;
		for(var x = 0; x < getLi.length; x++){
			if(getLi[x].className == 'active'){
				foundActive = getLi[x].id.replace('list_', '');
				break;			
			}
		}
		return Number(foundActive);
	}
	//select big image based on the id
	var selectImage = function(id){
		var holder = document.getElementById('imgIn');
		var imageData = getImageDataById(id);
		var photoCaption = document.getElementById('photoCaption');
		
		createBigImg(id, holder);
		createThumbHighLight(id);
		moveHighilightIntoView(id);
		
		photoCaption.innerHTML = mObjs[id].caption;
	};
	//start auto play of the ul based on the _CG settings duration
	var startAutoPlay = function(ulList, time){
		ulList.timer = setInterval(function(){
			moveRight();
		}, time)		
	};
	var stopAnimation = function(){
		var listH = document.getElementById('listH');
		clearInterval(listH.timer);
	}
	//when clicking the next or prev stop the interval for auto rotate and reset it again to the _CG settings
	var resetAutoPlayOnClick = function(){
		var listH = document.getElementById('listH');
		clearInterval(listH.timer);
		startAutoPlay(listH, _CG.autoplay.autorotate.duration);
	};
	//reset animation reset _CG active and the cookie value recevied to 0
	//applies on the reset btn of the gallery
	var resetAnimation = function(){
		doReset = true;
		_CG.isActive = 0;
		var stringAction = 'reset';
		if(saveCurrent(stringAction)){
			console.log('save current true')
			selectImage(_CG.isActive);
			resetAutoPlayOnClick();
		}
	};
	//saves the current image into cookie based on the active li
	var saveCurrent = function(stringAction){
		stopAnimation();
		var listH = document.getElementById('listH'),
			activeLi = getActiveEl(listH),
			imgArr = _CG.cookie.get(CGSettings.setCookieName);
			
		for(var i=0; i < imgArr.length; i++){
			var matchExact = imgArr[i].match('active_' + getCActive); //match exact entry used on the save btn
			var matchAp = imgArr[i].match('active_'); //match aproximative active used from reset animation fn
			
			if(doReset == true){
				imgArr[i] = imgArr[i].replace(matchExact, 'active_0'); //goes here when the reset button its presed sets the cookie back from 0
			}else{
				imgArr[i] = imgArr[i].replace(matchExact, 'active_' + activeLi);
			}
		}
		confirmationPopup(stringAction,imgArr);
	};
	var removeCurrent = function(){
		var removeString = 'delete';
		var listH = document.getElementById('listH'),
			imgIn = document.getElementById('imgIn'),
			activeLi = getActiveEl(listH),
			getCurrentLi = document.getElementById('list_' + activeLi),
			imgArr = _CG.cookie.get(CGSettings.setCookieName);
			
		
		var getTName = getThumbNames();
		for(var x = 0; x < getTName.length; x++){
			var currentT = document.getElementById('thumb_' + getTName[x]);
			var currentB = mObjs[x].src,
				matchSrc = currentB.match(CGSettings.imagesdir),
				replaceSrc = currentB.replace(matchSrc, ''); //replace extensions and get only the image name and apply id to the img thumbs
			
			if(currentT.parentNode == getCurrentLi){
				for(var i=0; i < imgArr.length; i++){
					var matchAT = imgArr[i].match(currentT.id + '.jpg'); //match active thumb
					var matchBA = imgArr[i].match(replaceSrc); //match big image active
					
					if(matchAT){
						imgArr[i] = imgArr[i].replace(matchAT, ''); //goes here when the reset button its presed sets the cookie back from 0
					}else if(matchBA){
						//removeA(imgArr[i], matchBA)
						imgArr[i] = imgArr[i].replace(matchBA, '');
				
					}
				}
				break;
			}
			
		}
		imgArr.clean("");
		confirmationPopup(removeString,imgArr)
	};

	var getThumbNames = function(){
		var saveNew = [];
		for(var x = 0; x < mObjs.length; x++){
			var bigSrc = mObjs[x].thumb,
				matchSrc = bigSrc.match(CGSettings.thumbdir),
				replaceSrc = bigSrc.replace(matchSrc, ''), //replace the images path
				matchExt = replaceSrc.match(CGSettings.fileTypes), //match extensions
				rmvExtension = replaceSrc.replace(matchExt, ''); //replace extensions and get only the image name and apply id to the img thumbs
				
			saveNew.push(rmvExtension)
		}
		return saveNew;
	}
	var removeA = function (arr){
		var what, a= arguments, L= a.length, ax;
		while(L> 1 && arr.length){
			what= a[--L];
			while((ax= arr.indexOf(what))!= -1){
				console.log(ax)
				arr.splice(ax, 1);
			}
		}
		return arr;
	}
	//builds the html for the poup confirmation with yes and no btn
	//checks for confirmation fn and returns either false or true based on what the user clicks
	var confirmationPopup = function(action, sendImages){
		var alertHolder = document.createElement('div');
		var wrapper = document.getElementById('wrapper');
		alertHolder.setAttribute('id', 'alertHolder');
		alertHolder.innerHTML = ('<div class="innerHolder"><div>Are you sure you want to '+ action +'?</div>'+
								 '<div class="btnBig left" id="btnYes">Yes</div><div id="btnNo" class="btnBig right">No</div>'+
								 '<div class="clear"><!-- empty --></div></div>'
								 );
		wrapper.appendChild(alertHolder);
		
		var btnYes = document.getElementById('btnYes');
		var btnNo = document.getElementById('btnNo');
		var activeLi = getActiveEl(listH);
		var getCurrentLi = document.getElementById('list_' + activeLi);
		var getCurrentBig = document.getElementById('img_' + activeLi);

		if(btnYes){
			btnYes.onclick = function(){
				if(action == 'delete'){
					getCurrentLi.style.display = 'none';
					getCurrentBig.style.display = 'none';
					moveRight();

				}
				//on click save the new updated cookies
				_CG.cookie.setCVal(CGSettings.setCookieName, sendImages, _CG._settings.expireTime);
				wrapper.removeChild(alertHolder);
				return true;
			}
			btnNo.onclick = function(){
				wrapper.removeChild(alertHolder);
				return false;
			}		
		}
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var onHoverStart = function(e, ulList) {
		var deltaX = getPosition(thumbH);
		var scrollX;
		var getWidth = storeUlWidth(ulList);
		var width = Number(getWidth.replace('px', ''));
		
		deltaX = e.pageX - deltaX.x;
		
		//user starts to scroll right
		if(deltaX >= width){
			deltaX = deltaX / 1;
			scrollX = - (deltaX - width);
		}else if(deltaX <= width){
			//deltaX = 0;
			scrollX = - (deltaX);
		}

		ulList.style.left = scrollX + 'px';
	};
	var getPosition = function(element) {
		var xPosition = 0;
		var yPosition = 0;
		while(element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	}

	/*	
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
    }
	this.initList = function(){
		return initialize();
	}*/
	if(CGSettings.placeTarget != ''){
		if(mainHolder){
			if(doneLoading === true){
				initList();
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
