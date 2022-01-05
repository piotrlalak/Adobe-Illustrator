//Select Similar Sized Objects
//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
if(app.activeDocument.selection.length > 0 && app.activeDocument.selection.length < 2){
	$.writeln('Correct Selection: ' + (selection.length) + ' item' );
	inputTolerance = 0.05 // 5%
	userInput();
	if(doSomething===true){
		selectSimilarSized(app.activeDocument.selection[0]);
	}else{
		//do nothing
	}
}else{
	$.writeln('Incorrect Selection: ' + (selection.length) + ' item(s)' );
}
//-----------------------------------------------------------------------------------------------------------------------------------
function selectSimilarSized(item){
	targetBounds = boundsToSizes(visibleObjectBounds(item));
	tWidth = item.width//boundsToSizes(visibleObjectBounds(item))[0];
	tHeight = item.height//boundsToSizes(visibleObjectBounds(item))[1];
	//--------------------------------------------------------
	$.writeln('Looking through layers... Tolerance: ' + (inputTolerance * 100) + '%');
	totalItemCount = 0
	similarItemCount = 0
	for(a=0;a<app.activeDocument.layers.length;a++){
		sublayerItems(app.activeDocument.layers[a]);
	}
	$.writeln('Total Item Count: ' + totalItemCount);
	$.writeln('Similar Sized Item Count: ' + similarItemCount);
	//--------------------------------------------------------
}
//-----------------------------------------------------------------------------------------------------------------------------------
function sublayerItems(object){
	if(object.layers.length>0){
		for(l=0;l<object.layers.length;l++){
			sublayerItems(object.layers[l]);
		}
	}else{
		//$.writeln('>>> ' + object.name + ' <<<');
		for(p=0;p<object.pageItems.length;p++){
			currentBounds = boundsToSizes(visibleObjectBounds(object.pageItems[p]));
			//cWidth = object.pageItems[p].width
			//cHeight = object.pageItems[p].height
			sizeMatch = false;
			//--------------------------------------------------------
			isSimilarSize(currentBounds);
			//isSimilarSize2(cWidth,cHeight);
			if(sizeMatch === true){
				object.pageItems[p].selected = true;
			}
			//--------------------------------------------------------
			totalItemCount++;
		}
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function visibleObjectBounds(object){
	var objectBounds = [];
	switch(object.typename){
		case 'PathItem':
			objectBounds = object.geometricBounds;
			break;
		case 'CompoundPathItem':
			objectBounds = object.geometricBounds;
			break;
		case 'GroupItem':
			if(object.clipped === true){
				objectBounds = object.pageItems[0].geometricBounds;
			}else{
				objectBounds = object.pageItems[0].geometricBounds;
				for(var g=1;g<object.pageItems.length;g++){
					if(object.pageItems[g].typename !== 'GroupItem'){
						objectBounds = replaceBiggerBounds(object.pageItems[g].geometricBounds,objectBounds);
					}else{
						subBounds = visibleObjectBounds(object.pageItems[g]);
						objectBounds = replaceBiggerBounds(subBounds,objectBounds);
					}
				}
			}
			break;
		default:
			objectBounds = object.geometricBounds;
			break;
	}
	return objectBounds;
}
//-----------------------------------------------------------------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------------------------------------------------------------
function boundsToSizes(bounds){
	sizes = [neg2pos(bounds[0]-bounds[2]),neg2pos(bounds[1]-bounds[3])]
	return sizes;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function neg2pos(value){
	if(value < 0){
		newValue = value / -1
	}else{
		newValue = value;
	}
	return newValue;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function isSimilarSize2(cWidth,cHeight){
	wTolerance = cWidth * inputTolerance;
	hTolerance = cHeight * inputTolerance;
	aTolerance = (wTolerance * hTolerance) * inputTolerance;
	//----------------------------------------------------
	switch(mode){
		case 0:
			if(wTolerance <= tWidth + wTolerance && itemBounds[0] >= targetBounds[0] - wTolerance){
			}
				
		case 1:
			itemArea = (itemBounds[0] * itemBounds[1]);
			targetArea = (targetBounds[0]  * targetBounds[1])
			if(itemArea <= targetArea + aTolerance && itemArea >= targetArea - aTolerance){
				sizeMatch = true;
				similarItemCount++;
			}else{
				sizeMatch = false;
			}
			break;
		default:
			itemArea = (itemBounds[0] * itemBounds[1]);
			targetArea = (targetBounds[0]  * targetBounds[1])
			if(itemArea <= targetArea + aTolerance && itemArea >= targetArea - aTolerance){
				sizeMatch = true;
				similarItemCount++;
			}else{
				sizeMatch = false;
			}
			break;
		}
	//----------------------------------------------------
}
//-----------------------------------------------------------------------------------------------------------------------------------
function isSimilarSize(itemBounds){
	wTolerance = itemBounds[0] * inputTolerance;
	hTolerance = itemBounds[1] * inputTolerance;
	aTolerance = (itemBounds[0] * itemBounds[1]) * inputTolerance;
	//----------------------------------------------------
	switch(mode){
		case 0:
			if(itemBounds[0] <= targetBounds[0] + wTolerance && itemBounds[0] >= targetBounds[0] - wTolerance){
				if(itemBounds[1] <= targetBounds[1] + hTolerance && itemBounds[1] >= targetBounds[1] - hTolerance){
					//$.writeln(' > Match Found');
					sizeMatch = true;
					similarItemCount++;
				}else{
					//$.writeln('X');
					sizeMatch = false;
				}
			}else{
				//$.writeln('X');
				sizeMatch = false;
			}
			break;
		case 1:
			itemArea = (itemBounds[0] * itemBounds[1]);
			targetArea = (targetBounds[0]  * targetBounds[1])
			if(itemArea <= targetArea + aTolerance && itemArea >= targetArea - aTolerance){
				sizeMatch = true;
				similarItemCount++;
			}else{
				sizeMatch = false;
			}
			break;
		default:
			itemArea = (itemBounds[0] * itemBounds[1]);
			targetArea = (targetBounds[0]  * targetBounds[1])
			if(itemArea <= targetArea + aTolerance && itemArea >= targetArea - aTolerance){
				sizeMatch = true;
				similarItemCount++;
			}else{
				sizeMatch = false;
			}
			break;
		}
	//----------------------------------------------------
}
//-----------------------------------------------------------------------------------------------------------------------------------
function userInput(){
	doSomething = false;
	//----------------------------------------------------
	w = new Window ('dialog',"SelectSimilarSized");
	mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	typeGroup = mainGroup.add ('group');
	typeGroup.orientation = 'row'
		xyRadio = typeGroup.add ("RadioButton", undefined, 'XY (Width / Height)');
		xyRadio.value = true;
		areaRadio = typeGroup.add ("RadioButton", undefined, 'Area');
		//areaRadio.enabled = false;
	//----------------------------------------------------
	toleranceGroup = mainGroup.add ('group');
	toleranceGroup.orientation = 'row'
		toleranceStatic = toleranceGroup.add ("statictext", undefined, 'Tolerance');
		toleranceInput = toleranceGroup.add ("edittext", ([undefined,undefined,50,21]), '5');
		percentStatic = toleranceGroup.add ("statictext", undefined, '%');
	//----------------------------------------------------
	buttonGroup = mainGroup.add ('group');
	buttonGroup.orientation = 'row'
		okButton = buttonGroup.add ("button", undefined, "OK");
		okButton.onClick = function (){
			doSomething = true;
			w.close();
		}
			cancelButton = buttonGroup.add ("button", undefined, "Cancel");
		cancelButton.onClick = function (){
			doSomething = false;
			w.close();
		}
	w.show();
	//----------------------------------------------------
	mode = 0;
	if(xyRadio.value === true){
		mode=0;
	}else{
		mode=1;
	}	
	inputTolerance = (parseFloat(toleranceInput.text))/100;
	//----------------------------------------------------
	return doSomething,mode,inputTolerance;
}
//-----------------------------------------------------------------------------------------------------------------------------------