//------------------------------------------------
userInputMode()
//------------------------------------------------
if(doSomething === true){
	if(app.activeDocument.selection.length === 0){
		sortItems(app.activeDocument.activeLayer,true,mode)
	}else{
		//------------------------------------------------
		initialParent = app.activeDocument.selection[0].parent
		tempGroup = initialParent.groupItems.add();
		//------------------------------------------------
		for(a=0;a<app.activeDocument.selection.length;a++){
			tempItem = app.activeDocument.selection[a];
			tempItem.move(tempGroup, ElementPlacement.PLACEATBEGINNING);
		}
		//------------------------------------------------
		sortItems(tempGroup,true,mode);
		//------------------------------------------------
		for(a=tempGroup.pageItems.length-1;a>=0;a--){
			tempItem = tempGroup.pageItems[a];
			tempItem.move(initialParent, ElementPlacement.PLACEATBEGINNING);
		}
	}
}else{
	//do nothing;
}
//---------------------------------------------------------------------------------------------
function sortItems(location,order,mode){
	if(mode < 2){
		for(f = 0; f < location.pageItems.length; f++){
			for(e = 0; e < location.pageItems.length; e++){
					currentItem = location.pageItems[e];
				if(e > 0){
						previousItem = location.pageItems[(e-1)];
					if(order === true){
						if (itemXYfunction(currentItem)[mode] < itemXYfunction(previousItem)[mode]){
						currentItem.move(location, ElementPlacement.PLACEATBEGINNING);
						}
					}else{
						if (itemXYfunction(currentItem)[mode] > itemXYfunction(previousItem)[mode]){
							currentItem.move(location, ElementPlacement.PLACEATBEGINNING);
						}
						previousItem = currentItem;
					}
				}
			}
		}
	}else{
		for(f=0;f<location.pageItems.length;f++){
			randomNumber = Math.floor((Math.random() * (location.pageItems.length-1)) + 1);
			currentItem = location.pageItems[randomNumber]
			currentItem.move(location, ElementPlacement.PLACEATBEGINNING);
		}
	}
}
//------------------------------------------------
function reverseLayerOrder(layer){
	var layerItemsLength = layer.pageItems.length-1;
	for (i=0; i<=layerItemsLength; ++i){
		var layerItem =layer.pageItems[i];
		layerItem.move(layer, ElementPlacement.PLACEATBEGINNING);
	}    
}
//----------------------------------------------------
function visibleObjectBounds(item){
	var itemBounds = [];
	switch(item.typename){
		case 'PathItem':
			itemBounds = item.geometricBounds;
			break;
		case 'CompoundPathItem':
			itemBounds = item.geometricBounds;
			break;
		case 'GroupItem':
			if(item.clipped === true){
				itemBounds = item.pageItems[0].geometricBounds;
			}else{
				itemBounds = item.pageItems[0].geometricBounds;
				for(var g=1;g<item.pageItems.length;g++){
					if(item.pageItems[g].typename !== 'GroupItem'){
						itemBounds = replaceBiggerBounds(item.pageItems[g].geometricBounds,itemBounds);
					}else{
						subBounds = visibleObjectBounds(item.pageItems[g]);
						itemBounds = replaceBiggerBounds(subBounds,itemBounds);
					}
				}
			}
			break;
		default:
			itemBounds = item.geometricBounds;
			break;
	}
	return itemBounds;
}
//--------------------------------------------------------
function replaceBiggerBounds(newBounds,oldBounds){//replaces bounds if they are bigger
	//--------------------------------------------------------
	if(newBounds[0] < oldBounds[0]){
		oldBounds[0] = newBounds[0];
	}
	//--------------------------------------------------------
	if(newBounds[1] > oldBounds[1]){
		oldBounds[1] = newBounds[1];
	}
	//--------------------------------------------------------
	if(newBounds[2] > oldBounds[2]){
		oldBounds[2] = newBounds[2];
	}
	//--------------------------------------------------------
	if(newBounds[3] < oldBounds[3]){
		oldBounds[3] = newBounds[3];
	}
	return oldBounds;
}
//--------------------------------------------------------
function itemXYfunction(item){
	bounds = visibleObjectBounds(item)
	itemX = bounds[0] + ((bounds[2] - bounds[0])/2);
	itemY = -bounds[1] - ((bounds[3] - bounds[1])/2);
	itemXY = [itemX,itemY]
	return itemXY;
}
//------------------------------------------------
function userInputMode(){
	//----------------------------------------------------
	mode = 0;
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"Sort");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	sortByXMode = mainGroup.add ("radiobutton", undefined, 'Sort by X');
	sortByXMode.value = true;
	sortByYMode = mainGroup.add ("radiobutton", undefined, 'Sort by Y');
	randomMode = mainGroup.add ("radiobutton", undefined, 'Random');
	//----------------------------------------------------
	var okButton = window.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	sortByXMode.onClick = function (){
		sortByXMode.value = true;
		sortByYMode.value = false;
		randomMode.value = false;
		mode = 0;
	}
	sortByYMode.onClick = function (){
		sortByXMode.value = false;
		sortByYMode.value = true;
		randomMode.value = false;
		mode = 1;              
	}
	randomMode.onClick = function (){
		sortByXMode.value = false;
		sortByYMode.value = false;
		randomMode.value = true;
		mode = 2;              
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	return mode,doSomething;
}