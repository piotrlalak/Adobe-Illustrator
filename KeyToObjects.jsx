$.writeln('\n-------------- KeyToObjects.jsx --------------\nApplying scale & opacity by black value...\n');
userInput();
if(doSomething === true){
	current_selection = app.activeDocument.selection
	if (current_selection.length > 1){
		
		units = 72/25.4;
		objectsMap = app.activeDocument.selection[0]
		halftone = app.activeDocument.selection[1]
		mappedObjectsGroup = app.activeDocument.activeLayer.groupItems.add();
		
		keyToObjects(objectsMap,halftone)
	}
}
$.writeln('\n--------------      Finished       --------------');
//-----------------------------------------------------------------------------------------------------------------------------------
function keyToObjects(objectMap_group,halftone_group){
	$.writeln("keyToObjects - halftone length: " + halftone_group.pageItems.length + ", objects map length: " + objectsMap.pageItems.length)
	
	for(a=0;a<halftone_group.pageItems.length;a++){
		
		c_h_item = halftone_group.pageItems[a]
		c_XY = boundsToXY(c_h_item.geometricBounds)
		c_h_item_size = visibleObjectBounds(c_h_item)
		c_h_item_width = -(c_h_item_size[0]-c_h_item_size[2])/units
		
		//--------------------------

		if(c_h_item.fillColor.typename === 'CMYKColor'){ 
			c_h_item_key = c_h_item.fillColor.black
		}else if(c_h_item.fillColor.typename === 'GrayColor'){
			c_h_item_key= c_h_item.fillColor.gray
		}else{
			continue
		}
	
		c_h_item_key = 100-c_h_item_key
	
		//--------------------------

		c_multiplier = 100 / (objectsMap.pageItems.length-1)
		c_h_index = c_h_item_key/c_multiplier
		c_h_index = c_h_index.toFixed(0)
		c_h_index = parseInt(c_h_index)
				
		//--------------------------
		
		mapped_object = objectsMap.pageItems[c_h_index].duplicate(mappedObjectsGroup, ElementPlacement.PLACEATBEGINNING);
		m_XY = boundsToXY(mapped_object.geometricBounds)
		m_size = visibleObjectBounds(mapped_object)
		m_width = -(m_size[0]-m_size[2])/units
		
		//--------------------------

		c_scale = c_h_item_width / m_width * 100
		rescaleArtwork (mapped_object,c_scale,true)
		mapped_object.translate(c_XY[0]-m_XY[0],m_XY[1]-c_XY[1],true,true,true,true)

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
//----------------------------------------------------
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
//----------------------------------------------------
function boundsToXY(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			-bounds[1] - ((bounds[3] - bounds[1])/2)
			]
	return xy;
}
//----------------------------------------------------
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
//----------------------------------------------------
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
function cmykValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>100){
		v=100;
	}
	return v;
}
//----------------------------------------------------
function customColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
}
//----------------------------------------------------
function crosshair(x,y,s,l){ //development only
	
	//--------------------------------------------------------
	scale = 1;
	//--------------------------------------------------------
	crosshairGroup = l.groupItems.add();
	crosshairGroup.name = 'Crosshair'
	//--------------------------------------------------------
	line = crosshairGroup.pathItems.add();
	line.setEntirePath([[x,-y+((s/2)*units)],[x,-y-((s/2)*units)]])
	line.filled = false;
	line.stroked = true;
	line.strokeColor = customColour(100,0,0,0);
	line.strokeWidth = scale * units / 4;
	line.strokeDashes = [];
	//--------------------------------------------------------
	line.duplicate(crosshairGroup,ElementPlacement.PLACEATEND)
	crosshairGroup.pageItems[0].rotate(90,true,true,true,true,Transformation.CENTER);
	//--------------------------------------------------------
	return crosshairGroup;
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"KeyToObjects");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will map object from 1st group');
		info1 = infoGroup.add ("statictext", undefined,'to each path in 2nd group based on key value.');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
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