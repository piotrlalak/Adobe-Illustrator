//--------------------------------------------------------
units = 72/25.4

temp_doc_name = app.activeDocument.name.split('.')[0]
temp_doc_name = temp_doc_name.split(' ')[0]

userInput()
//--------------------------------------------------------
if(doSomething === true){
	if(app.activeDocument.selection.length > 0){
		prepressPartcodeBoxes()
	}
}
//--------------------------------------------------------
function prepressPartcodeBoxes(){
	
	app.activeDocument.rulerOrigin = [0,0]
	createLayer('Partcode Boxes')
	
	boxes_layer = app.activeDocument.layers.getByName('Partcode Boxes');
	new_boxes_group = boxes_layer.groupItems.add();
	new_boxes_group.name = 'Partcode Boxes'
	
	currentSelectionBounds = selectionBounds(selection)
	expandedBounds = addOffsetToBounds(currentSelectionBounds,boxXOffsetInput*units,boxYOffsetInput*units)
	
	horizontalOrigins = createRectOriginsH(expandedBounds,selection.length+4)
	itemCentres = itemCentreList(selection)
	
	pairs_list = findAnchorPairs(horizontalOrigins,itemCentres)
	
	for(n=0;n<pairs_list.length;n++){
		
		boxName = pairs_list[n][1][1]
		if(boxName.slice(0,8)=='BaseCut-'){
			boxName = baseCutString(boxName)
			boxName = printPartcodeString(boxName)
			boxType = 'Print'
		}else{
			boxType = 'Cut'
		}
	
		if(addPrefix == true){
			boxName = prefixInput+boxName
		}

		newBox(
					pairs_list[n][0][0],
					pairs_list[n][1][0],
					boxWidthInput*units,
					boxHeightInput*units,
					new_boxes_group,
					boxType,
					boxName,
					fontSizeInput
					)
					
	}
}
//--------------------------------------------------------
function printPartcodeString(string){
	new_string = string[0]
	p_char = string[0]
	$.writeln(string.length)
	for(cchar=1;cchar<string.length;cchar++){
		p_char = string[cchar-1]
		c_char = string[cchar]
		if(isNaN(parseInt(p_char))==true && isNaN(parseInt(c_char))==false){
			new_string = new_string + 'P'
		}
		new_string = new_string + c_char
	}
	return new_string
}
//--------------------------------------------------------
function baseCutString(string){
	new_string = string
	if(string.slice(0,8)=='BaseCut-'){
		new_string = new_string.slice(8)
	}
	return new_string
}
//--------------------------------------------------------
function anchorDistance(ad,bd){
	xV = ad[0] - bd[0]
	yV = ad[1] - bd[1]
	dist = Math.sqrt(xV*xV + yV*yV)
	return dist
}
//--------------------------------------------------------
function findAnchorPairs(arrayA,arrayB){
	
	pairList = []
	
	temp_arrayA = arrayA
	temp_arrayB = arrayB
	temp_arrayA = sort_array(temp_arrayA,0)
	temp_arrayB = sort_array(temp_arrayB,0)

	if(temp_arrayA.length < temp_arrayB.length){
		k_range = temp_arrayA.length
	}else{
		k_range = temp_arrayB.length
	}
	
	for(k=0;k<k_range;k++){
		
		//$.writeln('temp_arrayA.length: ' + temp_arrayA.length + ' | temp_arrayB.length: ' + temp_arrayB.length)
		
		if(temp_arrayA.length < temp_arrayB.length){
			t_length = temp_arrayA.length-1
		}else{
			t_length = temp_arrayB.length-1
		}
				
		randomInt = (Math.random()*t_length).toFixed(0)
		//$.writeln('randomInt: ' + randomInt)
		c_anchorA = temp_arrayA[randomInt]
		c_anchorB = temp_arrayB[randomInt]
		c_dist = anchorDistance(c_anchorA[0],c_anchorB[0])
		c_nearestNeighbours = [c_anchorA,c_anchorB]
		
		//$.writeln(c_anchorA[1] + ' - ' + c_anchorA[1])
		
		for(var aA=0;aA<temp_arrayA.length;aA++){
			for(var bA=0;bA<temp_arrayB.length;bA++){
				t_anchorA = temp_arrayA[aA]
				t_anchorB = temp_arrayB[bA]
				t_dist = anchorDistance(t_anchorA[0],t_anchorB[0])
				if(t_dist < c_dist){
					c_nearestNeighbours = [t_anchorA,t_anchorB]
					anchorIndexes = [aA,bA]
				}
			}
		}
	
		pairList.push(c_nearestNeighbours)
		temp_arrayA = removeFromArray(temp_arrayA,anchorIndexes[0])
		temp_arrayB = removeFromArray(temp_arrayB,anchorIndexes[1])
	}
	
	return pairList
}
//--------------------------------------------------------
function sort_array(array,value_type){
	array = array.sort(function(a, b) {
	vA = a[0][value_type]
	vB = b[0][value_type]
	if (vA > vB) {
		return -1;
	}
	if (vA < vB) {
		return 1;
	}
	return 0;
	})
	return array
}
//--------------------------------------------------------
function itemCentreList(selection){
	itemCentresArray = []
	for(ic=0;ic<selection.length;ic++){
		currentItem = selection[ic]
		currentItemCentre = itemCentre(currentItem.geometricBounds)
		itemCentresArray.push([currentItemCentre,currentItem.name])
	}
	return itemCentresArray;
}
//--------------------------------------------------------
function createRectOriginsH(expandedBounds,itemLength){
	rectOriginArray = []
	nItems = parseInt(Math.ceil(itemLength/2))-1
	boxSpacingIncrement = neg2pos(expandedBounds[0] - expandedBounds[2])/nItems
	
	n_counter = 1
	//top edge
	for(h=0;h<nItems+1;h++){
		currentXOffset = boxSpacingIncrement * h
		rectOriginArray.push([[expandedBounds[0]+currentXOffset,expandedBounds[1]],'Point ' + n_counter])
		n_counter++
	}

	//bottom edge
	for(h=0;h<nItems+1;h++){
		currentXOffset = boxSpacingIncrement * h
		rectOriginArray.push([[expandedBounds[0]+currentXOffset,expandedBounds[3]],'Point ' + n_counter])
		n_counter++
	}

	return rectOriginArray
}
//--------------------------------------------------------
function isEven(number){
	if(number % 2 == 0){
		isEvenBool = true
	}else{
		isEvenBool = false
	}
	return isEvenBool
}
//--------------------------------------------------------
function addOffsetToBounds(bounds,offsetX,offsetY){
	newBounds = [bounds[0]-offsetX,bounds[1]+offsetY,bounds[2]+offsetX,bounds[3]-offsetY]
	return newBounds
}
//--------------------------------------------------------
function selectionBounds(selection){
	temp_selection_bounds = visibleObjectBounds(selection[0])
	for(sb=1;sb<selection.length;sb++){
		current_item_bounds = visibleObjectBounds(selection[sb])
		temp_selection_bounds = replaceBiggerBounds(current_item_bounds,temp_selection_bounds)
		}
	return temp_selection_bounds
}
//--------------------------------------------------------
function itemCentre(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			bounds[1] + ((bounds[3] - bounds[1])/2)
			]
	return xy;
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
//-------------------------------------------------------- 
function cmykValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>100){
		v=100;
	}
	return v;
}
//-------------------------------------------------------- 
function createLayer(layer_name){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name === layer_name){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = layer_name;
			break;
		}
	}
}
//-------------------------------------------------------- 
function removeFromArray(array,n_index){
	old_array = array
	new_array = []
	for(rfa=0;rfa<old_array.length;rfa++){
		if(n_index !== rfa ){
			new_array.push(old_array[rfa])
		}
	}
	return new_array
}
//-------------------------------------------------------- 
function neg2pos(value){
	if(value < 0){
		newValue = value / -1
	}else{
		newValue = value;
	}
	return newValue;
}
//-------------------------------------------------------- 
function degrees(x){
	return x * 180 / Math.PI 
}
//-------------------------------------------------------- 
function radians(x){	
	return x * (Math.PI / 180);
}
//-------------------------------------------------------- 
function p2cX(length,angle){ //polar to cartesian
	return length * Math.cos(radians(angle))
}
//-------------------------------------------------------- 
function p2cY(length,angle){ //polar to cartesian
	return length * Math.sin(radians(angle));
}
//-------------------------------------------------------- 
function c2pL(x,y){ //cartesian to polar
	return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}
//-------------------------------------------------------- 
function c2pA(x,y){ //cartesian to polar
	return degrees(Math.atan(y/x));
}
//-------------------------------------------------------- 
function customColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
}
//-------------------------------------------------------- 
function createRect(rect,l,fc,sc){
	newRect = l.pathItems.add(0,0,0,0,false,false);
	newRect.setEntirePath([
	[rect[0] , rect[1] ],
	[rect[2] , rect[1] ],
	[rect[2] , rect[3] ],
	[rect[0] , rect[3] ]
	]);
	newRect.closed = true
	
	if(fc != false){
		newRect.filled = true
		newRect.fillColor = fc
	}
	if(sc != false){
		newRect.stroked = true
		newRect.strokeColor = sc
	}

	return newRect
}
//-------------------------------------------------------- 
function createLine(anchors,l){ //development only
	//--------------------------------------------------------
	line = l.pathItems.add();
	line.setEntirePath(anchors)
	line.filled = false;
	line.stroked = true;
	line.strokeColor = customColour(0,0,0,100);
	line.strokeWidth = 1 * units / 4;
	line.strokeDashes = [];
	//--------------------------------------------------------
	return line;
}
//-------------------------------------------------------- 
function newBox(x,y,w,h,location,colour,text,text_s){
	
	newBoxGroup = location.groupItems.add();
	newBoxGroup.name = text
	//----------------------------------------------------

	box_width = w//boxWidthInput * units //15
	box_height = h//boxHeightInput * units //5

	stroke_width = 0.5 * units
	font_scale_factor = 1.4834594273846610295208426049548
	text_size = text_s * units * font_scale_factor

	text_cetreline_offset = 1.043 * units
	text_offset = (text_size / 2) * units

	type_die_colour = customColour(0,100,0,0)
	type_kiss_colour = customColour(100,0,0,0)
	type_other_colour = customColour(100,0,100,0)
	white_colour = customColour(0,0,0,0)
	
	//---------------------------------------------------- TYPE BOX 

	base_line = newBoxGroup.pathItems.add(0,0,0,0,false,false);
	base_line.setEntirePath([x,y]);
	base_line.closed = false;
	base_line.filled = false;
	base_line.stroked = true;
	
	base_line.strokeWidth = stroke_width;
	base_line.strokeDashes = [];
	
	base_box = newBoxGroup.pathItems.add(0,0,0,0,false,false);

	base_box.setEntirePath([
	[x[0]-(box_width/2),x[1]+(box_height/2)],
	[x[0]+(box_width/2),x[1]+(box_height/2)],
	[x[0]+box_width/2,x[1]-(box_height/2)],
	[x[0]-(box_width/2),x[1]-(box_height/2)]
	]);
	
	base_box.closed = true;
	base_box.filled = true;
	base_box.stroked = false;

	switch(colour){
		case 'PRINT':
			base_box.fillColor = type_die_colour;
			base_line.strokeColor = type_die_colour;
			break;
		case 'Print':
			base_box.fillColor = type_die_colour;
			base_line.strokeColor = type_die_colour;
			break;
		case 'CUT':
			base_box.fillColor = type_kiss_colour;
			base_line.strokeColor = type_kiss_colour;
			break;
		case 'Cut':
			base_box.fillColor = type_kiss_colour;
			base_line.strokeColor = type_kiss_colour;
			break;
		default:
			base_box.fillColor = type_other_colour;
			base_line.strokeColor = type_other_colour;
	}

	new_pointText = newBoxGroup.textFrames.pointText([x[0],x[1]-(text_s*units/2)],TextOrientation.HORIZONTAL)
	new_pointText.contents = text;	
	new_pointText.textRange.characterAttributes.size = text_size;
	new_pointText.textRange.characterAttributes.fillColor = white_colour;
	new_pointText.textRange.paragraphAttributes.justification = Justification.CENTER;
	new_pointText.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Semibold');

}
//-------------------------------------------------------- 
function crosshair(x,y,s,l){ //development only
	
	//--------------------------------------------------------
	scale = 1;
	//--------------------------------------------------------
	crosshairGroup = l.groupItems.add();
	crosshairGroup.name = 'Crosshair'
	//--------------------------------------------------------
	line = crosshairGroup.pathItems.add();
	//line.setEntirePath([[x,-y+((s/2)*units)],[x,-y-((s/2)*units)]]) //ORIGINAL
	line.setEntirePath([[x,y+((s/2)*units)],[x,y-((s/2)*units)]])
	line.filled = false;
	line.stroked = true;
	line.strokeColor = customColour(0,0,0,100);
	line.strokeWidth = scale * units / 4;
	line.strokeDashes = [];
	//--------------------------------------------------------
	line.duplicate(crosshairGroup,ElementPlacement.PLACEATEND)
	crosshairGroup.pageItems[0].rotate(90,true,true,true,true,Transformation.CENTER);
	//--------------------------------------------------------
	return crosshairGroup;
}
//-------------------------------------------------------- 
function stringReplacement(a,b,c){//a-string, b- target, c-replacement
	$.writeln('--------------->  stringReplacement')
	//---------------------------------
	originalString = a
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
					if(c === undefined){
						continue
					}else{
						replacedString += c;
					}
				}
				//---------------------------------
			}
		}
		//---------------------------------
		if(matchedString === false && i < loopLength){
			if(c === undefined){
				continue
			}else{
				replacedString += a[i];
			}
		}
		//---------------------------------
	}
	//---------------------------------
	if(originalString === ''){
		replacedString = originalString
	}
	//---------------------------------
	return replacedString;
}
//-------------------------------------------------------- 
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"PrepressPartcodesBoxes");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create partcodes boxes');
		info2 = infoGroup.add ("statictext", undefined,'from selected csv.');
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	
	var prefixGroup = mainGroup.add ('group');
	prefixGroup.orientation = 'column'
	prefixGroup.alignChildren = 'center'
	prefixCheck = prefixGroup.add ("checkbox", undefined, 'Add prefix');
		var prefixInputGroup = prefixGroup.add ('group');
		prefixInputGroup.orientation = 'row'
		prefixInputGroup.alignChildren = 'center'
		prefixStatic = prefixInputGroup.add ("statictext", undefined, 'Prefix: ');
		prefixInputEdit = prefixInputGroup.add ("edittext", ([undefined,undefined,100,21]), temp_doc_name);
		prefixInputGroup.enabled = true
		prefixCheck.value = true
	
	divider2 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	
	var sizesGroup = mainGroup.add ('group');
	sizesGroup.orientation = 'column'
	sizesGroup.alignChildren = 'right'

	var boxXOffsetGroup = sizesGroup.add ('group');
	boxXOffsetGroup.orientation = 'row'
	boxXOffsetGroup.alignChildren = 'center'
	boxXOffsetStatic = boxXOffsetGroup.add ("statictext", undefined, 'X Offset: ');
	boxXOffsetInputEdit = boxXOffsetGroup.add ("edittext", ([undefined,undefined,50,21]), 0);
	
	var boxYOffsetGroup = sizesGroup.add ('group');
	boxYOffsetGroup.orientation = 'row'
	boxYOffsetGroup.alignChildren = 'center'
	boxYOffsetStatic = boxYOffsetGroup.add ("statictext", undefined, 'Y Offset: ');
	boxYOffsetInputEdit = boxYOffsetGroup.add ("edittext", ([undefined,undefined,50,21]), 10);

	var boxWidthGroup = sizesGroup.add ('group');
	boxWidthGroup.orientation = 'row'
	boxWidthGroup.alignChildren = 'center'
	boxWidthStatic = boxWidthGroup.add ("statictext", undefined, 'Box width: ');
	boxWidthInputEdit = boxWidthGroup.add ("edittext", ([undefined,undefined,50,21]), 65);
	
	var boxHeightGroup = sizesGroup.add ('group');
	boxHeightGroup.orientation = 'row'
	boxHeightGroup.alignChildren = 'center'
	boxHeightStatic = boxHeightGroup.add ("statictext", undefined, 'Box height: ');
	boxHeightInputEdit = boxHeightGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
	
	var fontSizeGroup = sizesGroup.add ('group');
	fontSizeGroup.orientation = 'row'
	fontSizeGroup.alignChildren = 'center'
	fontStatic = fontSizeGroup.add ("statictext", undefined, 'Font size: ');
	fontInputEdit = fontSizeGroup.add ("edittext", ([undefined,undefined,50,21]), 5);
	
	var strokeSizeGroup = sizesGroup.add ('group');
	strokeSizeGroup.orientation = 'row'
	strokeSizeGroup.alignChildren = 'center'
	strokeStatic = strokeSizeGroup.add ("statictext", undefined, 'Stroke thickness: ');
	strokeInputEdit = strokeSizeGroup.add ("edittext", ([undefined,undefined,50,21]), 0.5);
	
	divider3 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//---------------------------------------------------- 
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Ok");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	//----------------------------------------------------
	w.show();
	//----------------------------------------------------
	if(prefixCheck.value === true){
		addPrefix = true
	}else{
		addPrefix = false
	}
	//nameSize = parseFloat(nameSizeInput.text)
	//----------------------------------------------------
	prefixInput = prefixInputEdit.text
	boxXOffsetInput = boxXOffsetInputEdit.text
	boxYOffsetInput = boxYOffsetInputEdit.text
	boxWidthInput = boxWidthInputEdit.text
	boxHeightInput = boxHeightInputEdit.text
	fontSizeInput = fontInputEdit.text
	strokeThicnkessInput = strokeInputEdit.text

	return doSomething,addPrefix,prefixInput,boxWidthInput,boxHeightInput,fontSizeInput,boxXOffsetInput,boxYOffsetInput,strokeThicnkessInput;//,nameSize;
}