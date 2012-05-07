function buildList(){
	var _list = this;
	if(mainObjSettings.placeTarget != ''){
		var mainHolder = document.getElementById(mainObjSettings.placeTarget);
	
		if(mainHolder){
	
			if(doneLoading === true){
				var ulList = document.createElement('ul');
				
				var liList = document.createElement('li');
				liList.innerHTML = 'here goes the gallery images';
				
				
				mainHolder.appendChild(ulList);
				ulList.appendChild(liList);
				
				console.log('there is the target');
			
			}
		}
	}
}