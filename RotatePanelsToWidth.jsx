//----------------------------------------------------------------------------------------------------------------------------------------
var doc = app.activeDocument;
var units = 72/25.4
var tolerance = 1 //mm
//----------------------------------------------------------------------------------------------------------------------------------------
materialWidthInput()
//----------------------------------------------------------------------------------------------------------------------------------------
var objectsToRotate = app.activeDocument.selection;
if (objectsToRotate.length > 0){
	//$.writeln('Rotate Each Object if its bigger than the material width')
	for(a=0;a<objectsToRotate.length;a++){
		var currentObject = objectsToRotate[a];
		var currentObjectWidth = neg2pos(visibleObjectBounds(currentObject)[0]-visibleObjectBounds(currentObject)[2]);
		if (currentObjectWidth  > materialWidth + (tolerance/materialScale/units)){
			objectRotate(currentObject, 90)
			}
		}
}else{
	alert('There are no selected objects', 'Empty Selection')
}
//----------------------------------------------------------------------------------------------------------------------------------------
function materialWidthInput(){
	var w = new Window ('dialog');
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	var materialPanel = mainGroup.add('panel',undefined , 'Material Width', {borderStyle:'white'});
	materialPanel.orientation = 'row'
	var inputWidth = materialPanel.add ("edittext", ([undefined,undefined,50,17]), '1290');
	var unitsText = materialPanel.add ("statictext", undefined, 'mm');
	var scalePanel = mainGroup.add('panel',undefined , 'Scale', {borderStyle:'white'});
	scalePanel.orientation = 'row'
	var unitsText = scalePanel.add ("statictext", undefined, 'Factor 1:');
	var inputScale = scalePanel.add ("edittext", ([undefined,undefined,30,21]), '10');
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		materialScale  = 1/(parseInt(inputScale.text));
		materialWidth = inputWidth.text
		materialWidth  = (parseInt(inputWidth.text)*units*materialScale)
		w.close();
	}
	w.show();
	return materialWidth,materialScale;
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