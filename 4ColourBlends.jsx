units = 72/25.4
doSomething = false;

if(app.activeDocument.selection.length==4){
	userInput()//doSomething,colsInput,rowsInput,offsetXInput,offsetYInput,widthInput,heightInput,addValueText,textSizeInput,addTriangle,triangleSizeInput,addStroke,strokeSizeInput
}

if(doSomething==true){
	currentColourArray = getSelectionColours()
	if(currentColourArray === false){
		doSomething = false
		alert('Selection must consist of 4 squares with raw CMYK values.\nCurrent selection is either less than 4 colours or one of them is a spot/swatch tint.','Incorrect selection')
	}else{
		mainColourBlend()
	}
}

function mainColourBlend(){

	xOrigin = app.activeDocument.artboards[0].artboardRect[0] 
	yOrigin = -app.activeDocument.artboards[0].artboardRect[1] 
	
	activeLayer = app.activeDocument.activeLayer
	mainStrokeWidth = strokeSizeInput * units
	labelSize = textSizeInput
	triangleSize = triangleSizeInput * units
	
	//----------------------------------------------------
	
	chip_width = widthInput * units
	chip_height = heightInput * units
	
	temp_cols = colsInput
	temp_rows = rowsInput
	
	if(temp_cols<2){
		temp_cols=2
	}

	if(temp_rows<2){
		temp_rows=2
	}
	
	startX = xOrigin + (offsetXInput * units)
	startY = yOrigin + (offsetYInput * units)
	
	currentColourArray = getSelectionColours()
	
	cMatrix = [
					currentColourArray[3].colour.cyan,
					currentColourArray[2].colour.cyan,
					currentColourArray[1].colour.cyan,
					currentColourArray[0].colour.cyan
					]
	
	cMatrix = colourBlendMatrix(cMatrix,temp_cols,temp_rows)
	
	mMatrix = [
					currentColourArray[3].colour.magenta,
					currentColourArray[2].colour.magenta,
					currentColourArray[1].colour.magenta,
					currentColourArray[0].colour.magenta
					]
	
	mMatrix = colourBlendMatrix(mMatrix,temp_cols,temp_rows)	
	
	yMatrix = [
					currentColourArray[3].colour.yellow,
					currentColourArray[2].colour.yellow,
					currentColourArray[1].colour.yellow,
					currentColourArray[0].colour.yellow
					]
					
	yMatrix = colourBlendMatrix(yMatrix,temp_cols,temp_rows)	
	
	
	kMatrix = [
					currentColourArray[3].colour.black,
					currentColourArray[2].colour.black,
					currentColourArray[1].colour.black,
					currentColourArray[0].colour.black
					]
	
	kMatrix = colourBlendMatrix(kMatrix,temp_cols,temp_rows)

	//newLayer = createLayer('Colour Chips')
	newColourChipGroup = activeLayer.groupItems.add();
	newColourChipGroup.name = 'Colour Chips'
	
	for(r=0;r<temp_rows;r++){
		
		temp_row_offset = -startY-(chip_height * r)
		
		for(c=0;c<temp_cols;c++){
			
			temp_col_offset = startX+chip_width * c
	
			temp_colour_c = parseFloat(cMatrix[r][c].toFixed(2))
			temp_colour_m = parseFloat(mMatrix[r][c].toFixed(2))
			temp_colour_y = parseFloat(yMatrix[r][c].toFixed(2))
			temp_colour_k = parseFloat(kMatrix[r][c].toFixed(2))
	
			temp_chipName =( 
									temp_colour_c +
									' | ' + temp_colour_m +
									' | ' + temp_colour_y+
									' | ' + temp_colour_k
									)
	
			colourChip(temp_col_offset,
							temp_row_offset,
							chip_width,chip_height,
							newColourChipGroup,
							temp_colour_c,
							temp_colour_m,
							temp_colour_y,
							temp_colour_k,
							temp_chipName
							)
	
		}
	}
}
//----------------------------------------------------
function colourChip(xp,yp,width,height,l,c,m,y,k,s){
	//----------------------------------------------------
	var c = parseFloat(c.toFixed(2))
	var m = parseFloat(m.toFixed(2))
	var y = parseFloat(y.toFixed(2))
	var k = parseFloat(k.toFixed(2))
	//----------------------------------------------------
	newChipGroup = l.groupItems.add();
	newChipGroup.name = 'C' + cmykValue(c) +
									'-M' + cmykValue(m) +
									'-Y' + cmykValue(y) +
									'-K' + cmykValue(k);
	//----------------------------------------------------
	var newChip = newChipGroup.pathItems.add(xp,yp,width,height,false,false);
	newChip.setEntirePath([[xp,yp],[xp+width,yp],[xp+width,yp-height],[xp,yp-height]]);
	newChip.closed = true;

	if(addStroke==true){
		if(strokeSizeInput>0){
			newChip.stroked = true;
			newChip.strokeColor = whiteColour();
			newChip.strokeWidth = mainStrokeWidth;
			newChip.strokeDashes = [];
		}
	}else{
		newChip.stroked = false;
	}
	
	newChip.filled = true;
	newChip.fillColor = customColour(c,m,y,k);
	
	//----------------------------------------------------

	if(addTriangle==true){
		if(triangleSizeInput>0){
			triangleMarker(xp,yp,whiteColour(),triangleSize,newChipGroup);
		}
	}
	
	if(addValueText==true){
		if(textSizeInput>0){
			chipNname(xp + (width/2),yp-height+(6*units),whiteColour(),newChipGroup,s)
		}
	}

	//----------------------------------------------------
}
function whiteColour(){
	var whiteCMYK = new CMYKColor();
	whiteCMYK.cyan = 0;
	whiteCMYK.magenta = 0;
	whiteCMYK.yellow = 0;
	whiteCMYK.black = 0;
	return whiteCMYK;
}
//----------------------------------------------------
function blackColour(){
	var blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK;
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
function triangleMarker(xp,yp,c,s,l){
	var newTriangle = l.pathItems.add();
	newTriangle.setEntirePath([[xp,yp],[xp+s,yp],[xp,yp-s]]);
	newTriangle.closed = true;
	newTriangle.stroked = false;
	newTriangle.filled = true;
	newTriangle.fillColor = c;
}
//----------------------------------------------------
function chipNname(xp,yp,c,l,s){
	var chipNoTextFrame = l.textFrames.add();
	chipNoTextFrame.contents = s;
	chipNoTextFrame.top = yp
	chipNoTextFrame.left = xp
	chipNoTextFrame.textRange.characterAttributes.fillColor = c;
	chipNoTextFrame.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;
	chipNoTextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	chipNoTextFrame.textRange.characterAttributes.size = labelSize * units * 1.48258;
	//----------------------------------------------------
	/*
	if(valueLabels === true){
		chipNoTextFrame.textRange.characterAttributes.size = 3 * units;
	}else{
		chipNoTextFrame.textRange.characterAttributes.size = 4 * units;
	}
	/*
	if(valueLabels === true){
		chipNoTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');
		for(var r=0; r<3;r++){
			chipNoTextFrame.textRanges[r].characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Bold');
		}
	}
	*/
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
//--------------------------------------------------------
function colourBlendMatrix(inputColourArray,cb_columns,cb_rows){

	var temp_colour_tl = inputColourArray[0]
	var temp_colour_tr = inputColourArray[1]
	var temp_colour_bl = inputColourArray[2]
	var temp_colour_br = inputColourArray[3]
	
	var temp_left_horizontal_increment = (temp_colour_tr - temp_colour_tl) / (cb_columns-1)
	var temp_vertical_increment = (temp_colour_tr - temp_colour_tl) / (cb_rows-1)
	
	//------------------------------------------ side edges

	var left_edge_array = []
	for(e=0;e<cb_rows;e++){
		var temp_i = ((temp_colour_bl - temp_colour_tl) / (cb_rows-1))
		var temp_v = temp_colour_tl + (temp_i*e)
		left_edge_array.push(temp_v)
	}

	var right_edge_array = []
	for(e=0;e<cb_rows;e++){
		var temp_i = ((temp_colour_br - temp_colour_tr) / (cb_rows-1))
		var temp_v = temp_colour_tr + (temp_i*e)
		right_edge_array.push(temp_v)
	}
	
	//------------------------------------------ matrix

	var temp_matrix = []
	for(r=0;r<cb_rows;r++){
		var temp_rows = []
		for(c=0;c<cb_columns;c++){
			var temp_va = left_edge_array[r]
			var temp_vb = right_edge_array[r]
			var temp_i = ((temp_vb - temp_va) / (cb_columns-1))
			var temp_v = temp_va + (temp_i*c)
			temp_rows.push(temp_v)
		}
		temp_matrix.push(temp_rows)
	}

	return temp_matrix

}
//--------------------------------------------------------
function getSelectionColours(){
	var currentColourArray = false
	if(app.activeDocument.selection.length > 3){
		tempSelectionArray = app.activeDocument.selection
		//-------------------------------------------------------
		selectionCentre = boundsToXY(selectionSize(tempSelectionArray))
		//-------------------------------------------------------
		currentColourArray = [];
		for(c=0;c<tempSelectionArray.length;c++){
			temp_colour = selectedColours(tempSelectionArray[c])
			$.writeln(temp_colour)
			if(temp_colour.typename == 'CMYKColor'){
				temp_colour_chip = {colour:temp_colour,position:relativePos(selectionCentre,boundsToXY(visibleObjectBounds(tempSelectionArray[c])))}
				currentColourArray.push(temp_colour_chip)
				$.writeln('appended')
			}
		}
	
		//-------------------------------------------------------
		currentColourArray.sort(sortArray)
		//-------------------------------------------------------
		$.writeln(currentColourArray)
		
		if(currentColourArray.length < 4){
			currentColourArray = false
		}
	
	}
	return currentColourArray
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
//-------------------------------------------------------
function selectedColours(object){
	switch(object.typename){
		case 'PathItem':
			selectedColour = object.fillColor
			break;
		default:
			selectedColour = object.fillColor
			break;
	}
	return selectedColour;
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
//--------------------------------------------------------
function selectionSize(array){
	selectionSizeBounds = visibleObjectBounds(array[0])
	for(s=1;s<array.length;s++){
		selectionSizeBounds = replaceBiggerBounds(visibleObjectBounds(array[s]),selectionSizeBounds)
	}
	return selectionSizeBounds;
}
//--------------------------------------------------------
function boundsToXY(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			-bounds[1] - ((bounds[3] - bounds[1])/2)
			]
	return xy;
}
//--------------------------------------------------------
function relativePos(xy1,xy2){
	/*
		xy1 = relative
		xy2 = target
		
		position layout:
		1 2
		3 4
	*/
	//--------------------------------------------------------
	position = 1; //default
	if(xy2[0]<xy1[0]){ //0 or 2
		if(xy2[1]<xy1[1]){
			position = 1
		}else{
			position = 3
		}
	}else{// 1 or 3
		if(xy2[1]<xy1[1]){
			position = 2
		}else{
			position = 4
		}
	}
	//--------------------------------------------------------
	return position
}
//--------------------------------------------------------
function sortArray(a,b) {
  if (a.position > b.position)
    return -1;
  if (a.position < b.position)
    return 1;
  return 0;
}
//-------------------------------------------------------
function createLayer(layerName){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name == layerName){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = layerName;
			break;
		}
	}
	return app.activeDocument.layers.getByName(layerName)
}
//--------------------------------------------------------
function crosshair(x,y,s,l,colorArray){ //development only
	//--------------------------------------------------------
	crosshairGroup = l.groupItems.add();
	crosshairGroup.name = 'Crosshair'
	//--------------------------------------------------------
	line = crosshairGroup.pathItems.add();
	line.setEntirePath([[x,-y+((s/2)*units)],[x,-y-((s/2)*units)]])
	line.filled = false;
	line.stroked = true;
	if(colorArray!=null){
		line.strokeColor = customColour(colorArray[0],colorArray[1],colorArray[2],colorArray[3]);
	}else{
		line.strokeColor = blackColour();
	}
	line.strokeWidth = 1 * units / 4;
	line.strokeDashes = [];
	//--------------------------------------------------------
	line.duplicate(crosshairGroup,ElementPlacement.PLACEATEND)
	crosshairGroup.pageItems[0].rotate(90,true,true,true,true,Transformation.CENTER);
	//--------------------------------------------------------
	return crosshairGroup;
}
//--------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var dialog = new Window("dialog"); 
		dialog.text = "4ColourBlends"; 
		dialog.orientation = "column"; 
		dialog.alignChildren = ["center","top"]; 
		dialog.spacing = 10; 
		dialog.margins = 16; 
	
	var statictext1 = dialog.add("group", undefined , {name: "statictext1"}); 
		statictext1.getText = function() { var t=[]; for ( var n=0; n<statictext1.children.length; n++ ) { var text = statictext1.children[n].text || ''; if ( text === '' ) text = ' '; t.push( text ); } return t.join('\n'); }; 
		statictext1.orientation = "column"; 
		statictext1.alignChildren = ["center","center"]; 
		statictext1.spacing = 0; 
	
		statictext1.add("statictext", undefined, "Script creates blend"); 
		statictext1.add("statictext", undefined, "between 4 selected colours."); 
	
	// GROUP1
	// ======
	var group1 = dialog.add("group", undefined, {name: "group1"}); 
		group1.orientation = "column"; 
		group1.alignChildren = ["fill","top"]; 
		group1.spacing = 10; 
		group1.margins = 0; 
	
	// PANEL1
	// ======
	var panel1 = group1.add("panel", undefined, undefined, {name: "panel1"}); 
		panel1.text = "Blend Size"; 
		panel1.orientation = "column"; 
		panel1.alignChildren = ["fill","top"]; 
		panel1.spacing = 10; 
		panel1.margins = 10; 
	
	// GROUP2
	// ======
	var group2 = panel1.add("group", undefined, {name: "group2"}); 
		group2.orientation = "row"; 
		group2.alignChildren = ["left","center"]; 
		group2.spacing = 10; 
		group2.margins = 0; 
	
	var statictext2 = group2.add("statictext", undefined, undefined, {name: "statictext2"}); 
		statictext2.text = "Columns:"; 
	
	var edittext1 = group2.add('edittext {properties: {name: "edittext1"}}'); 
		edittext1.text = "11"; 
		edittext1.preferredSize.width = 40; 
	
	var statictext3 = group2.add("statictext", undefined, undefined, {name: "statictext3"}); 
		statictext3.text = "Rows:"; 
	
	var edittext2 = group2.add('edittext {properties: {name: "edittext2"}}'); 
		edittext2.text = "11"; 
		edittext2.preferredSize.width = 40; 
	
	// GROUP3
	// ======
	var group3 = dialog.add("group", undefined, {name: "group3"}); 
		group3.orientation = "column"; 
		group3.alignChildren = ["fill","top"]; 
		group3.spacing = 10; 
		group3.margins = 0; 
	
	// PANEL2
	// ======
	var panel2 = group3.add("panel", undefined, undefined, {name: "panel2"}); 
		panel2.text = "Artboard offset"; 
		panel2.orientation = "column"; 
		panel2.alignChildren = ["fill","top"]; 
		panel2.spacing = 10; 
		panel2.margins = 10; 
	
	// GROUP4
	// ======
	var group4 = panel2.add("group", undefined, {name: "group4"}); 
		group4.orientation = "row"; 
		group4.alignChildren = ["left","center"]; 
		group4.spacing = 10; 
		group4.margins = 0; 
	
	var statictext4 = group4.add("statictext", undefined, undefined, {name: "statictext4"}); 
		statictext4.text = "X:"; 
	
	var edittext3 = group4.add('edittext {properties: {name: "edittext3"}}'); 
		edittext3.text = "11.5"; 
		edittext3.preferredSize.width = 40; 
	
	var statictext5 = group4.add("statictext", undefined, undefined, {name: "statictext5"}); 
		statictext5.text = "Y:"; 
	
	var edittext4 = group4.add('edittext {properties: {name: "edittext4"}}'); 
		edittext4.text = "29.5"; 
		edittext4.preferredSize.width = 40; 
	
	// GROUP5
	// ======
	var group5 = dialog.add("group", undefined, {name: "group5"}); 
		group5.orientation = "column"; 
		group5.alignChildren = ["fill","top"]; 
		group5.spacing = 10; 
		group5.margins = 0; 
	
	// PANEL3
	// ======
	var panel3 = group5.add("panel", undefined, undefined, {name: "panel3"}); 
		panel3.text = "Colour chip size"; 
		panel3.orientation = "column"; 
		panel3.alignChildren = ["fill","top"]; 
		panel3.spacing = 10; 
		panel3.margins = 10; 
	
	// GROUP6
	// ======
	var group6 = panel3.add("group", undefined, {name: "group6"}); 
		group6.orientation = "row"; 
		group6.alignChildren = ["left","center"]; 
		group6.spacing = 10; 
		group6.margins = 0; 
	
	var statictext6 = group6.add("statictext", undefined, undefined, {name: "statictext6"}); 
		statictext6.text = "X:"; 
	
	var edittext5 = group6.add('edittext {properties: {name: "edittext5"}}'); 
		edittext5.text = "37"; 
		edittext5.preferredSize.width = 40; 
	
	var statictext7 = group6.add("statictext", undefined, undefined, {name: "statictext7"}); 
		statictext7.text = "Y:"; 
	
	var edittext6 = group6.add('edittext {properties: {name: "edittext6"}}'); 
		edittext6.text = "24.5"; 
		edittext6.preferredSize.width = 40; 
	
	// GROUP7
	// ======
	var group7 = dialog.add("group", undefined, {name: "group7"}); 
		group7.orientation = "column"; 
		group7.alignChildren = ["fill","top"]; 
		group7.spacing = 10; 
		group7.margins = 0; 
	
	// PANEL4
	// ======
	var panel4 = group7.add("panel", undefined, undefined, {name: "panel4"}); 
		panel4.text = "Values text"; 
		panel4.orientation = "column"; 
		panel4.alignChildren = ["fill","top"]; 
		panel4.spacing = 10; 
		panel4.margins = 10; 
	
	// GROUP8
	// ======
	var group8 = panel4.add("group", undefined, {name: "group8"}); 
		group8.orientation = "row"; 
		group8.alignChildren = ["left","center"]; 
		group8.spacing = 10; 
		group8.margins = 0; 
	
	var checkbox1 = group8.add("checkbox", undefined, undefined, {name: "checkbox1"}); 
		checkbox1.value = true
	
	var statictext8 = group8.add("statictext", undefined, undefined, {name: "statictext8"}); 
		statictext8.text = "Size:"; 
	
	var edittext7 = group8.add('edittext {properties: {name: "edittext7"}}'); 
		edittext7.text = "2"; 
		edittext7.preferredSize.width = 40; 
	
	// GROUP9
	// ======
	var group9 = dialog.add("group", undefined, {name: "group9"}); 
		group9.orientation = "column"; 
		group9.alignChildren = ["fill","top"]; 
		group9.spacing = 10; 
		group9.margins = 0; 
	
	// PANEL5
	// ======
	var panel5 = group9.add("panel", undefined, undefined, {name: "panel5"}); 
		panel5.text = "Corner triangle"; 
		panel5.orientation = "column"; 
		panel5.alignChildren = ["fill","top"]; 
		panel5.spacing = 10; 
		panel5.margins = 10; 
	
	// GROUP10
	// =======
	var group10 = panel5.add("group", undefined, {name: "group10"}); 
		group10.orientation = "row"; 
		group10.alignChildren = ["left","center"]; 
		group10.spacing = 10; 
		group10.margins = 0; 
	
	var checkbox2 = group10.add("checkbox", undefined, undefined, {name: "checkbox2"}); 
		checkbox2.value = true
		
	var statictext9 = group10.add("statictext", undefined, undefined, {name: "statictext9"}); 
		statictext9.text = "Size:"; 
	
	var edittext8 = group10.add('edittext {properties: {name: "edittext8"}}'); 
		edittext8.text = "5"; 
		edittext8.preferredSize.width = 40; 
	
	// GROUP11
	// =======
	var group11 = dialog.add("group", undefined, {name: "group11"}); 
		group11.orientation = "column"; 
		group11.alignChildren = ["fill","top"]; 
		group11.spacing = 10; 
		group11.margins = 0; 
	
	// PANEL6
	// ======
	var panel6 = group11.add("panel", undefined, undefined, {name: "panel6"}); 
		panel6.text = "Stroke width"; 
		panel6.orientation = "column"; 
		panel6.alignChildren = ["fill","top"]; 
		panel6.spacing = 10; 
		panel6.margins = 10; 
	
	// GROUP12
	// =======
	var group12 = panel6.add("group", undefined, {name: "group12"}); 
		group12.orientation = "row"; 
		group12.alignChildren = ["left","center"]; 
		group12.spacing = 10; 
		group12.margins = 0; 
	
	var checkbox3 = group12.add("checkbox", undefined, undefined, {name: "checkbox3"}); 
		checkbox3.value = true
	
	var statictext10 = group12.add("statictext", undefined, undefined, {name: "statictext10"}); 
		statictext10.text = "Size:"; 
	
	var edittext9 = group12.add('edittext {properties: {name: "edittext9"}}'); 
		edittext9.text = "1"; 
		edittext9.preferredSize.width = 40; 

	//----------------------------------------------------
	var okButton = dialog.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		dialog.close();
	}
	//----------------------------------------------------
	dialog.show();
	//----------------------------------------------------
	
	colsInput = parseInt(edittext1.text)
	rowsInput = parseInt(edittext2.text)
	offsetXInput = parseFloat(edittext3.text)
	offsetYInput = parseFloat(edittext4.text)
	widthInput = parseFloat(edittext5.text)
	heightInput = parseFloat(edittext6.text)
	
	addValueText = checkbox1.value
	textSizeInput = parseFloat(edittext7.text)
	addTriangle = checkbox2.value
	triangleSizeInput = parseFloat(edittext8.text)
	addStroke = checkbox3.value 
	strokeSizeInput = parseFloat(edittext9.text)
	
	//----------------------------------------------------
	return doSomething,colsInput,rowsInput,offsetXInput,offsetYInput,widthInput,heightInput,addValueText,textSizeInput,addTriangle,triangleSizeInput,addStroke,strokeSizeInput;
}