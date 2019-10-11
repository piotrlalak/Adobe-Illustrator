//----------------------------------------------------
userInputMode();
initialConstants();
//----------------------------------------------------
if(doSomething === true){
	switch(mode){
		case 0:
				for(d=0;d<1;d++){//2 duplicates the proces for greater accuracy
					straigthenSelected(app.activeDocument.selection);
				}
			break;
		case 1:
			if(app.activeDocument.selection.length > 1){
				for(d=0;d<1;d++){//2 duplicates the proces for greater accuracy
					rotateToWidth(app.activeDocument.selection);
				}
			break;
			}else{
				for(d=0;d<1;d++){//2 duplicates the proces for greater accuracy
					straigthenSelected(app.activeDocument.selection);
				}
			}
			break;
		default:
				for(d=0;d<1;d++){//2 duplicates the proces for greater accuracy
					straigthenSelected(app.activeDocument.selection);
				}
			break;
	}
}else{
	//do nothing;
}
//----------------------------------------------------
function initialConstants(){
	rotationFactor = inRotationFactor;
	rotationThreshold = inThresholdFactor;
	rotationAccuracy = 0.00001;
	sizeThreshold = 0.001;
	divisionFactor = inDivisionFactor;
	$.writeln('Rotation Factor: ' + rotationFactor + ' | Rotation Threshold: ' + rotationThreshold + ' | Division Factor: ' + divisionFactor);
}
//----------------------------------------------------
function rotateToWidth(selection){
	for(a=1;a<selection.length;a++){
		//----------------------------------------------------
		tw = neg2pos(visibleObjectBounds(selection[0])[0]-visibleObjectBounds(selection[0])[2]);//selection[0].width;
		//----------------------------------------------------
		iw = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2])//selection[a].width;
		deg=rotationFactor;
		objectRotate(selection[a], deg);
		selectionWidth = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width
		if(iw < selectionWidth){
			deg = (deg/-1)*2;
			objectRotate(selection[a], deg);
		}
		//----------------------------------------------------
		for(b=0;b<rotationThreshold;b++){
			iw = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2])//selection[a].width;
			objectRotate(selection[a], deg);
			//----------------------------------------------------
			selectionWidth = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width
			if(selectionWidth >= tw-sizeThreshold && selectionWidth <= tw+sizeThreshold){
				break;
			}
			//----------------------------------------------------
			if(selectionWidth > iw && selectionWidth > tw+sizeThreshold){
				deg = deg / divisionFactor;
			}else if (selectionWidth < iw && selectionWidth < tw-sizeThreshold){
				deg = deg / divisionFactor;
			}
			//----------------------------------------------------
			if(deg < rotationAccuracy && deg > - rotationAccuracy){
				break;
			}
			//----------------------------------------------------
			if(animate === true){
				redraw(); ///ANIMATION
			}
			//$.writeln('RTW: ' + b);
			//----------------------------------------------------
		}
		//----------------------------------------------------
	}
}
//----------------------------------------------------
function straigthenSelected(selection){
	for(a=0;a<selection.length;a++){
		//----------------------------------------------------
		iw = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width;//initial width
		deg=rotationFactor;
		objectRotate(selection[a], deg);
		selectionWidth = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width
		if(iw < selectionWidth){
			deg = (deg/-1)*2;
			objectRotate(selection[a], deg);
		}
		//----------------------------------------------------
		for(b=0;b<rotationThreshold;b++){
			iw = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width;
			objectRotate(selection[a], deg);
			selectionWidth = neg2pos(visibleObjectBounds(selection[a])[0]-visibleObjectBounds(selection[a])[2]);//selection[a].width
			if(iw <= selectionWidth -  sizeThreshold){
				deg = deg / divisionFactor;
			}
			//----------------------------------------------------
			if(animate === true){
				redraw(); ///ANIMATION
			}
			//$.writeln('S: ' + (b+1));
			//----------------------------------------------------
		}
		//----------------------------------------------------
	}
}
//----------------------------------------------------
function objectRotate(objectName, objectRotationDeg){
	
	(visibleObjectBounds(objectName))
    //finds initiall X/Y location
    var objectNameIntX = (visibleObjectBounds(objectName))[0] + (((visibleObjectBounds(objectName))[2] - (visibleObjectBounds(objectName))[0])/2);
    var objectNameIntY = -(visibleObjectBounds(objectName))[1] - (((visibleObjectBounds(objectName))[3] - (visibleObjectBounds(objectName))[1])/2);
    //rotation of non-symmetrical object shifts the position - algorythm below adjust the position
    objectName.rotate(
        objectRotationDeg /* rotation degree - negative number is clockwise*/,
        true /* changes position - always to stay true */,
        true /* changes patterns */,
        true /* changes gradients */,
        true /* changes stroke patterns */,
        Transformation.CENTER
    )
    //aligment - finds current X,Y
    var objectNameCurX = (visibleObjectBounds(objectName))[0] + (((visibleObjectBounds(objectName))[2] - (visibleObjectBounds(objectName))[0])/2);
    var objectNameCurY = -(visibleObjectBounds(objectName))[1] - (((visibleObjectBounds(objectName))[3] - (visibleObjectBounds(objectName))[1])/2);
    //aligment - calculate delta X,Y
    var deltaX = objectNameIntX -objectNameCurX;
    var deltaY = -(objectNameIntY -objectNameCurY);
    //$.writeln(deltaX);
    //$.writeln(deltaY);
    //aligment - shifvts to initial X,Y
    objectName.translate(
        deltaX, deltaY  /* shifts by difference (delta)*/,
        true /* changes position - always to stay true */,
        true /* changes patterns */,
        true /* changes gradients */,
        true /* changes stroke patterns */,
    )
	//redraw();
}
//-------------------------------------------------------- 
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
//----------------------------------------------------
function neg2pos(value){
	if(value < 0){
		newValue = value / -1
	}else{
		newValue = value;
	}
	return newValue;
}
//----------------------------------------------------
function userInputMode(){
	//----------------------------------------------------
	mode = 0;
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"Rotate Selected Objects");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	straightenMode = mainGroup.add ("radiobutton", undefined, 'Straighten');
	straightenMode.value = true;
	staticText1 = mainGroup.add ("statictext", undefined, 'Rotated to narrowest position');
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	rotateToWidthMode = mainGroup.add ("radiobutton", undefined, 'Rotate To Width');
	staticText2 = mainGroup.add ("statictext", undefined,'Rotated to width of leading object');
	staticText2.enabled = false;
	//----------------------------------------------------
	divider2 = window.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	rotationGroup = window.add('group');
	rotationGroup.orientation = 'row'
	rotationGroup.alignChildren = 'center'
	
		initialGroup = rotationGroup.add('group');
		initialGroup.orientation = 'column'
		initialGroup.alignChildren = 'center'
			staticText3 = initialGroup.add ("statictext", undefined,'Initial Rotation');
			inRotationFactorText = initialGroup.add ("edittext", [undefined,undefined,50,23], 45);
			
		divisionGroup = rotationGroup.add('group');
		divisionGroup.orientation = 'column'
		divisionGroup.alignChildren = 'center'
			staticText4 = divisionGroup.add ("statictext", undefined,'Rotation Division');
			inDivisionFactorText = divisionGroup.add ("edittext", [undefined,undefined,50,23], -2);
			
		thresholdGroup = rotationGroup.add('group');
		thresholdGroup.orientation = 'column'
		thresholdGroup.alignChildren = 'center'
			staticText5 = thresholdGroup.add ("statictext", undefined,'Rotation Threshold');
			inThresholdFactorText = thresholdGroup.add ("edittext", [undefined,undefined,50,23], 45);	
			
	staticText5 = window.add ("statictext", undefined,'Positive rotates to the left, negative to the right edge.');
	//----------------------------------------------------
	divider3 = window.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	animate = false;
	animateButton = window.add ("checkbox", undefined, 'Animate');
	animateButton.value = false;
	var okButton = window.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	straightenMode.onClick = function (){
		straightenMode.value = true;
		rotateToWidthMode.value = false;
		staticText1.enabled = true;
		staticText2.enabled = false;
		mode = 0;
	}
	rotateToWidthMode.onClick = function (){
		straightenMode.value = false;
		rotateToWidthMode.value = true;
		staticText1.enabled = false;
		staticText2.enabled = true;
		mode = 1;              
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	if(animateButton.value === true){
		animate = true;
	}
	inRotationFactor = inRotationFactorText.text
	inDivisionFactor = inDivisionFactorText.text
	inThresholdFactor = inThresholdFactorText.text
	//----------------------------------------------------
	return mode,inRotationFactor,inDivisionFactor,inThresholdFactor,doSomething,animate;
}