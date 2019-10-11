﻿//-----------------------------------------------------------------------------------------------------------------------------------
initialConstants();
findSizeExtremes(app.activeDocument.selection)
if(app.activeDocument.selection.length>0){
	userInput();
	if(doSomething===true){
		scaleItems(app.activeDocument.selection);
	}else{
		//do nothing
	}
}else{
	//do nothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function scaleItems(selection){
	for(a=0;a<selection.length;a++){
		currentItem = selection[a];
		currentScale = scaleFactor(boundsToSizes(visibleObjectBounds(selection[a])));
		rescaleArtwork (currentItem,currentScale,true);
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function findSizeExtremes(selection){
	if(selection.length>0){
		//$.writeln('Looking for size extremes....')
		//--------------------------------------------------------
		sWidth = boundsToSizes(visibleObjectBounds(selection[0]))[0];
		sHeight = boundsToSizes(visibleObjectBounds(selection[0]))[1];
		lWidth = boundsToSizes(visibleObjectBounds(selection[0]))[0];
		lHeight = boundsToSizes(visibleObjectBounds(selection[0]))[1];
		sWidthObject = selection[0];
		sHeightObject = selection[0];
		lWidthObject = selection[0];
		lHeightObject = selection[0];
		//--------------------------------------------------------
		for(a=0;a<selection.length;a++){
			cWidth = boundsToSizes(visibleObjectBounds(selection[a]))[0];
			cHeight = boundsToSizes(visibleObjectBounds(selection[a]))[1];
			if(cWidth<sWidth){
				sWidth = cWidth;
				sWidthObject = selection[a];
			}
			if(cWidth>lWidth){
				lWidth = cWidth;
				lWidthObject = selection[a];
			}
			if(cHeight<sHeight){
				sHeight = cHeight;
				sHeightObject = selection[a];
			}
			if(cHeight>lHeight){
				lHeight = cHeight;
				lHeightObject = selection[a];
			}
		}
		//--------------------------------------------------------
		/*
		app.activeDocument.selection = null;
		sWidthObject.selected = true;
		sHeightObject.selected = true;
		lWidthObject.selected = true;
		lHeightObject.selected = true;
		*/
		//--------------------------------------------------------
		/*$.writeln('-------------------------------------\nSmallest:\n  Width: '
				+ sWidth + '\n  Height: ' + sHeight + '\nLargest:\n  Width: ' + lWidth + '\n  Height: ' + lHeight);*/
	}else{
		//do nothing
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function boundsToSizes(bounds){
	sizes = [neg2pos(bounds[0]-bounds[2]),neg2pos(bounds[1]-bounds[3])]
	return sizes;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function scaleFactor(currentBounds){
	currentScaleFactor = 100;
	switch(mode){
		case 0:
			$.writeln('Downscale to width');
			currentScaleFactor = sWidth * 100 / currentBounds[0];
			break;
		case 1:
			$.writeln('Downscale to height');
			currentScaleFactor = sHeight * 100 / currentBounds[1];
			break;
		case 2:
			$.writeln('Upscale to width');
			currentScaleFactor = lWidth * 100 / currentBounds[0];
			break;
		case 3:
			$.writeln('Upscale to height');
			currentScaleFactor = lHeight * 100 / currentBounds[1]
			break;
		case 4:
			$.writeln('Custom width');
			currentScaleFactor = targetWidth * 100 / currentBounds[0];
			break;
		case 5:
			$.writeln('Custom height');
			currentScaleFactor = targetWidth * 100 / currentBounds[1];
			break;
		default:
			$.writeln('Downscale to width');
			currentScaleFactor = sWidth * 100 / currentBounds[0];
	}
	return currentScaleFactor;
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
function rescaleArtwork (item,scale,stroke){
	if (stroke == true){
		var strokeScale = scale;
		}else{
		var strokeScale = 0.0;
		}
	item.resize(
					scale,
					scale,
					true /*changes position - always true - required to change size*/ ,
					true /* changes pattern */ ,
					true /* changes gradient */ ,
					true /* changes stroke patterns */ , 
					strokeScale /* changes stroke width */ ,
					Transformation.CENTER
					);
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
function userInput(){
	//----------------------------------------------------
	w = new Window ('dialog',"ScaleMatch");
	mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	sizesGroup = mainGroup.add('panel',undefined,'Sizes',{borderStyle:'white'});
		sizesGroup.orientation = 'row'
		sizesGroup.alignChildren = 'centre'
			headersGroup = sizesGroup.add ('group');
			headersGroup.orientation = 'column'
			headersGroup.alignChildren = 'centre'
				emptyStatic = headersGroup.add ("statictext", undefined, undefined);
				smallestStatic = headersGroup.add ("statictext", undefined, 'Smallest:');
				largestStatic = headersGroup.add ("statictext", undefined, 'Largest:');
			divider1 = sizesGroup.add('panel',([undefined,undefined,undefined,75]),undefined,{borderStyle:'white'});
			widthsGroup = sizesGroup.add ('group');
			widthsGroup.orientation = 'column'
			widthsGroup.alignChildren = 'centre'
				widthStatic = widthsGroup.add ("statictext", undefined, 'Width (mm)');
				sWidthStatic = widthsGroup.add ("statictext", undefined, (sWidth/units).toFixed(3));
				lWidthStatic = widthsGroup.add ("statictext", undefined, (lWidth/units).toFixed(3));
			divider2 = sizesGroup.add('panel',([undefined,undefined,undefined,75]),undefined,{borderStyle:'white'});
			heightsGroup = sizesGroup.add ('group');
			heightsGroup.orientation = 'column'
			heightsGroup.alignChildren = 'centre'
				heigthStatic = heightsGroup.add ("statictext", undefined, 'Height (mm)');
				sHeightStatic = heightsGroup.add ("statictext", undefined, (sHeight/units).toFixed(3));
				lHeightStatic = heightsGroup.add ("statictext", undefined, (lHeight/units).toFixed(3));
	//----------------------------------------------------
	targetGroup = mainGroup.add('panel',undefined,'Target Size',{borderStyle:'white'});
	targetGroup.orientation = 'row'
	targetGroup.alignChildren = 'centre'
		targetInput = targetGroup.add ("edittext", [undefined,undefined,50,21], 1290);
		unitsSize = targetGroup.add ("statictext", undefined, 'mm');
		divider1 = targetGroup.add('panel',([undefined,undefined,undefined,30]),undefined,{borderStyle:'white'});
		scaleStatic = targetGroup.add ("statictext", undefined, 'Scale 1:');
		scaleInput = targetGroup.add ("edittext", [undefined,undefined,30,21], 10);
	//----------------------------------------------------
	scaleGroup = mainGroup.add('panel',undefined,'Scale',{borderStyle:'white'});
	scaleGroup.orientation = 'row'
	scaleGroup.alignChildren = 'centre'
		downscaleRadio = scaleGroup.add ("RadioButton", undefined, 'Downscale');
		downscaleRadio.value = true;
		upscaleRadio = scaleGroup.add ("RadioButton", undefined, 'Upscale');
		targetRadio = scaleGroup.add ("RadioButton", undefined, 'Custom Target');
	//----------------------------------------------------
	orientationGroup = mainGroup.add('panel',undefined,'Orientation',{borderStyle:'white'});
	orientationGroup.orientation = 'row'
	orientationGroup.alignChildren = 'center'
		widthRadio = orientationGroup.add ("RadioButton", undefined, 'Width');
		widthRadio.value = true;
		heigthRadio = orientationGroup.add ("RadioButton", undefined, 'Height');
	//----------------------------------------------------
	//divider5 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	doSomething = false;
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
	if(downscaleRadio.value === true){
		if(widthRadio.value === true){
			mode=0;
		}else{
			mode=1;
		}
	}else if(upscaleRadio.value === true){
		if(widthRadio.value === true){
			mode=2;
		}else{
			mode=3;
		}
	}else if(targetRadio){
		if(widthRadio.value === true){
			mode=4;
		}else{
			mode=5;
		}
	}
	//----------------------------------------------------
	targetWidth = (1/(parseFloat(scaleInput.text)) * units) * (parseFloat(targetInput.text))
	//----------------------------------------------------
	return mode,targetWidth;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function initialConstants(){
	units = 72/25.4;
}