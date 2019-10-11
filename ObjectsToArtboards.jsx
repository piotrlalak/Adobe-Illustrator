//-----------------------------------------------------------------------------------------------------------------------------------
userInput()
if(doSomething === true){
	removeAllArtboards();
	objectsToArtboards();
}else{
	//donothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function objectsToArtboards(){
	if(app.activeDocument.selection.length <= 0){
		for(a=0;a<app.activeDocument.layers.length;a++){
			if(app.activeDocument.layers[a].locked === false && app.activeDocument.layers[a].visible === true){
				for(b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
					//--------------------------------------------
					newArtboard = app.activeDocument.artboards.add(visibleObjectBounds(app.activeDocument.layers[a].pageItems[b]));
					//--------------------------------------------
					barcodeString = app.activeDocument.layers[a].pageItems[b].name; //Standard items ame
					placedItemName(app.activeDocument.layers[a].pageItems[b]);
					retreiveBarcode(app.activeDocument.layers[a].pageItems[b]); //Replaces name if there is a barcode
					newArtboard.name =  barcodeString;//insert function to retreive name from a barcode somwhere in the group
					//--------------------------------------------
				}
			}else{
				continue;
			}
		}
	}else{
		for(a=0;a<app.activeDocument.selection.length;a++){
			//--------------------------------------------
			newArtboard = app.activeDocument.artboards.add(visibleObjectBounds(app.activeDocument.selection[a]));
			//--------------------------------------------
			barcodeString = app.activeDocument.selection[a].name; //Standard items ame
			placedItemName(app.activeDocument.selection[a]);
			retreiveBarcode(app.activeDocument.selection[a]); //Replaces name if there is a barcode
			newArtboard.name =  barcodeString;//insert function to retreive name from a barcode somwhere in the group
			//--------------------------------------------
		}
	}
	removeArtboard(app.activeDocument.artboards.length/app.activeDocument.artboards.length-1)
}
//-----------------------------------------------------------------------------------------------------------------------------------
function removeArtboard(artboardIndex){
	if(app.activeDocument.artboards.length > 1){
		app.activeDocument.artboards[artboardIndex].remove();
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function retreiveBarcode(item){//lack of barcodeString throws error
	//--------------------------------------------
	switch(item.typename){
		case 'GroupItem':
			if(item.name === ''){
				if(item.name[0] === '*' && item.name[(item.name.length-1)] === '*'){
					barcodeString = stringReplacement(item.name,'*','');
				}else{
					for(var j=0;j<item.pageItems.length;j++){
						retreiveBarcode(item.pageItems[j]);
					}
				}
			}else{
				barcodeString = item.name
			}
			break;
		case 'TextFrame':
			$.writeln('  Text Frame Contents: ' + item.contents)
			if(item.contents[0] === '*' && item.contents[(item.contents.length-1)] === '*'){
				foundBarcode = true;
				barcodeString = item.contents;
				barcodeString = stringReplacement(barcodeString,'*','');
			}
			break;
		default:
			break;
	}
	//--------------------------------------------
	return barcodeString;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function placedItemName(item){
	if(item.typename === 'PlacedItem'){
		barcodeString =(item.file.displayName).split('.')[0];
	}
	//--------------------------------------------
	return barcodeString;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function stringReplacement(a,b,c){//a-string, b- target, c-replacement
	//---------------------------------
	replacedString = '';
	//---------------------------------
	var a = a.toString();
	var b = b.toString();
	var c = c.toString();
	//---------------------------------
	var a = a.split('');
	var b = b.split('');
	//---------------------------------
	loopLength = a.length;
	if(b.length>loopLength){
		loopLength = b.length;
	}
	if(c.length>loopLength){
		loopLength = c.length;
	}
	//---------------------------------
	matchedString = false;
	//---------------------------------
	for(i=0;i<loopLength;i++){
		//---------------------------------
		if(a[i] === b[0]){
			for(ii=0;ii<b.length;ii++){
				if(a[i+ii] !== b[ii]){
					break;
				}
				//---------------------------------
				if(ii>=b.length-1){
					i = i + b.length;
					replacedString += c;
				}
				//---------------------------------
			}
		}
		//---------------------------------
		if(matchedString === false && i < loopLength){
			replacedString += a[i];
		}
		//---------------------------------
	}
	//---------------------------------
	return replacedString;
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
function removeAllArtboards(){
	for(a=app.activeDocument.artboards.length-1;a>0;a--){
		app.activeDocument.artboards[a].remove();
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"ObjectsToArtboards");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create artboards');
		info2 = infoGroup.add ("statictext", undefined,'for every item in selection.');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	return doSomething;
}