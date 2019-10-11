﻿//----------------------------------------------------
initialConstants();
getSelectionColour();//top item's colour
getSelectionColours();//4-colour blend
userInput(selC,selM,selY,selK);
if(stackChips === true){
	xOrigin = app.activeDocument.artboards[0].artboardRect[0] + (11.5*units)
	yOrigin = app.activeDocument.artboards[0].artboardRect[1] + (-29 * units)
	colourChips(xOrigin,yOrigin,app.activeDocument.activeLayer,width,height,inC,inM,inY,inK,inInc,inCm)
}else{
	//
}
//----------------------------------------------------
function colourChips(xp,yp,l,width,height,c,m,y,k,inc,cm){
	//----------------------------------------------------
	var xi = xp + (width * 5)
	var yi = yp - (height * 5)
	if(l.locked === true){
		l.locked = false;
	}
	var l = l.groupItems.add();
	l.name = 'Colour Chips'
	//----------------------------------------------------
	for(a=-5;a<6;a++){
		//----------------------------------------------------
		var yp = yi + (a*height)
		var labelChar = labelChars.split('')[5-a]
		//----------------------------------------------------
		for(b=-5;b<6;b++){ 
			var xp = xi + (b*width)
			//----------------------------------------------------
			var chipLabel = labelChar + (5+b)
			if (chipLabel == 'F5'){
				chipLabel = 'F5 - Target'
			}
			if(valueLabels === true){
				/*
				chipLabel = 'C:' + parseFloat(cmykValue((valueIncrement (c,'c', inc, a, b, cm)).toFixed(1))) +
								'% M:' + parseFloat(cmykValue((valueIncrement (m,'m', inc, a, b, cm)).toFixed(1))) +
								'% Y:' + parseFloat(cmykValue((valueIncrement (y,'y', inc, a, b, cm)).toFixed(1))) +
								'% K:' + parseFloat(cmykValue((valueIncrement (k,'k', inc, a, b, cm)).toFixed(1))) + '%';
				*/
				chipLabel = (labelChar + (5+b)) + 
								' | ' + parseFloat(cmykValue((valueIncrement (c,'c', inc, a, b, cm)).toFixed(1))) +
								' | ' + parseFloat(cmykValue((valueIncrement (m,'m', inc, a, b, cm)).toFixed(1))) +
								' | ' + parseFloat(cmykValue((valueIncrement (y,'y', inc, a, b, cm)).toFixed(1))) +
								' | ' + parseFloat(cmykValue((valueIncrement (k,'k', inc, a, b, cm)).toFixed(1)));
			}
			//----------------------------------------------------
			colourChip(xp,
							yp,
							width,
							height,
							l,
							valueIncrement (c,'c', inc, a, b, cm),
							valueIncrement (m,'m', inc, a, b, cm),
							valueIncrement (y,'y', inc, a, b, cm),
							valueIncrement (k,'k', inc, a, b, cm),
							chipLabel);
			//redraw();
			//----------------------------------------------------
		}
	}
}
//----------------------------------------------------
function valueIncrement (v, t, inc, row, col, cm){
	switch(cm){
		//----------------------------------------------------
		case 0:
			switch(t){
				case 'c':
					v = v - valueMatrix13(inc,row,col)
					break;
				case 'm':
					v = v - valueMatrix13(inc,row,col)
					break;
				case 'y':
					v = v - valueMatrix13(inc,row,col)
					break;
				case 'k':
					v = v - valueMatrix13(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 1:
			switch(t){
				case 'c':
					v = v + valueMatrix13(inc,row,col)
					break;
				case 'm':
					v = v + valueMatrix13(inc,row,col)
					break;
				case 'y':
					v = v + valueMatrix13(inc,row,col)
					break;
				case 'k':
					v = v + valueMatrix13(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 2:
			switch(t){
				case 'c':
					v = v - valueMatrix8(inc,row,col)
					break;
				case 'm':
					v = v - valueMatrix7(inc,row,col)
					break;
				case 'y':
					v = v - valueMatrix6(inc,row,col)
					break;
				case 'k':
					v = v - valueMatrix5(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 3:
			switch(t){
				case 'c':
					v = v + valueMatrix8(inc,row,col)
					break;
				case 'm':
					v = v + valueMatrix7(inc,row,col)
					break;
				case 'y':
					v = v + valueMatrix6(inc,row,col)
					break;
				case 'k':
					v = v + valueMatrix5(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 4:
			switch(t){
				case 'c':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'm':
					v = v
					break;
				case 'y':
					v = v
					break;
				case 'k':
					v = v - valueMatrix3(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 5:
			switch(t){
				case 'c':
					v = v 
					break;
				case 'm':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'y':
					v = v
					break;
				case 'k':
					v = v - valueMatrix3(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 6:
			switch(t){
				case 'c':
					v = v
					break;
				case 'm':
					v = v
					break;
				case 'y':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'k':
					v = v - valueMatrix3(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 7:
			switch(t){
				case 'c':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'm':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'y':
					v = v - valueMatrix1(inc,row,col)
					break;
				case 'k':
					v = v - valueMatrix3(inc,row,col)
					break;
			}
			break;
		//----------------------------------------------------
		case 8:
			switch(t){
				case 'c':
					v = Math.floor(Math.random() * Math.floor(100))
					break;
				case 'm':
					v = Math.floor(Math.random() * Math.floor(100))
					break;
				case 'y':
					v = Math.floor(Math.random() * Math.floor(100))
					break;
				case 'k':
					v = Math.floor(Math.random() * Math.floor(100))
					break;
			}
			break;
		//----------------------------------------------------
		case 9: //BLEND 4 SQUARES - DEVELOPMENT
			switch(t){
				case 'c':
					v = valueMatrix4Blend(t,row,col)
					break;
				case 'm':
					v = valueMatrix4Blend(t,row,col)
					break;
				case 'y':
					v = valueMatrix4Blend(t,row,col)
					break;
				case 'k':
					v = valueMatrix4Blend(t,row,col)
					break;
			}
			break;
		//----------------------------------------------------
	}
	return v;
}
//----------------------------------------------------
function valueMatrix1(inc,row,col){// top: -5 to 5 / bottom: -5 to 5
	v = col
	return v*inc;
}
//----------------------------------------------------
function valueMatrix2(inc,row,col){// top: 5 to -5 / bottom: 5 to -5
	v = col / -1
	return v*inc;
}
//----------------------------------------------------
function valueMatrix3(inc,row,col){// top: -5 to -5 / bottom: 5 to 5
	v = row
	return v*inc;
}
//----------------------------------------------------
function valueMatrix4(inc,row,col){// top: 5 to 5 / bottom: -5 to -5
	v = row / -1
	return v * inc;
}
//----------------------------------------------------
function valueMatrix5(inc,row,col){// top: 10 to 0 / bottom: 0 to 0
	v = ( col + row ) / -1
	if (v < 0) {
		v = 0;
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix6(inc,row,col){ // top: 0 to 10 / bottom: 0 to 0
	v = ( col  - row )
	if (v < 0) {
		v = 0;
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix7(inc,row,col){ // top: 0 to 0 / bottom: 0 to 10
	v = ( col + row )
	if (v < 0) {
		v = 0;
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix8(inc,row,col){ // top: 0 to 0 / bottom: 10 to 0
	v = ( col - row) / -1
	if (v < 0) {
		v = 0;
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix9(inc,row,col){ // top: 6 to 0 (centre) / bottom: 0 to 0
	v = -col-( 5+(row))+1
	if (v < 0) {
		v = 0;
	}
	return v* inc;
}
//----------------------------------------------------
function valueMatrix10(inc,row,col){ // top: 0 (centre) to 6 / bottom: 0 to 0
	v = col-(5+(row))+1
	if (v < 0) {
		v = 0;
	}
	return v* inc;
}
//----------------------------------------------------
function valueMatrix11(inc,row,col){ // top: 0 to 0 / bottom: 0 (centre) to 6
	v = col-( 5-(row))+1
	if (v < 0) {
		v = 0;
	}
	return v* inc;
}
//----------------------------------------------------
function valueMatrix12(inc,row,col){ // top: 0 to 0 / bottom: 6 to 0 (centre)
	v = -col-(5-(row))+1
	if (v < 0) {
		v = 0;
	}
	return v* inc;
}
//----------------------------------------------------
function valueMatrix13(inc,row,col){ // 5 (edges) to 0 (centre) 
	v = 5
	if (row > -5 && row < 5 && col> -5 && col < 5){
		v = 4
	}
	if (row > -4 && row < 4 && col> -4 && col < 4){
		v = 3
	}
	if (row > -3 && row < 3 && col> -3 && col < 3){
		v = 2
	}
	if (row > -2 && row < 2 && col> -2 && col < 2){
		v = 1
	}
	if (row > -1 && row < 1 && col> -1 && col < 1){
		v = 0
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix14(inc,row,col){ // 0 (edges) to 5 (centre) 
	v = 0
	if (row > -5 && row < 5 && col > -5 && col < 5){
		v++
	}
	if (row > -4 && row < 4 && col> -4 && col < 4){
		v++
	}
	if (row > -3 && row < 3 && col> -3 && col < 3){
		v++
	}
	if (row > -2 && row < 2 && col> -2 && col < 2){
		v++
	}
	if (row > -1 && row < 1 && col> -1 && col < 1){
		v++
	}
	if (v < 0) {
		v = v/-1;
	}
	return v*inc;
}
//----------------------------------------------------
function valueMatrix4Blend(t,row,col){
	switch(t){
		case 'c':
			blendColour0 = currentColourArray[1].colour.cyan; //position 2
			blendColour1 = currentColourArray[3].colour.cyan; //position 1
			blendColour2 = currentColourArray[0].colour.cyan; //position 4
			blendColour3 = currentColourArray[2].colour.cyan; //position 3
			break;
		case 'm':
			blendColour0 = currentColourArray[1].colour.magenta;
			blendColour1 = currentColourArray[3].colour.magenta;
			blendColour2 = currentColourArray[0].colour.magenta;
			blendColour3 = currentColourArray[2].colour.magenta;
			break;
		case 'y':
			blendColour0 = currentColourArray[1].colour.yellow;
			blendColour1 = currentColourArray[3].colour.yellow;
			blendColour2 = currentColourArray[0].colour.yellow;
			blendColour3 = currentColourArray[2].colour.yellow;
			break;
		case 'k':
			blendColour0 = currentColourArray[1].colour.black;
			blendColour1 = currentColourArray[3].colour.black;
			blendColour2 = currentColourArray[0].colour.black;
			blendColour3 = currentColourArray[2].colour.black;
			break;
	}
	matrixSize = 10; // 11x11 square matrix minus 1 for zero-based numbering
	tI = (blendColour1 - blendColour0) / matrixSize //top blend increment
	bI = (blendColour3 - blendColour2) / matrixSize //bottom blend increment
	col = col + 5
	row = row + 5
	v = (blendColour0 + (tI * row)) + ( ( ( (blendColour2 + (bI * row)) - (blendColour0 + (tI * row)) ) / matrixSize) * col)
	return v;
}
//----------------------------------------------------
function initialConstants(){
	scale = 1; //input scale to be added
	units = 72/25.4; //constant conversion rate between points and milimeters
	width = 37*units
	height = 24.5*units
	colInt = 11;
	rowInt = 11;
	labelChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	infoTextInput1 = 'Script fills test print sheet with standard colour'
	infoTextInput2 = 'squares. Enter target CMYK values and increment'
	infoTextInput3 = 'percentage in the fields below. Values bigger than '
	infoTextInput4 = '100% and smaller than 0%, will be rounded up or';
	infoTextInput5 = 'down correspondingly. Central square (F5) is '
	infoTextInput6 = 'made out of initial CMYK target values.'
	releaseInfoText = '09/02/2018 V.1.00'
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
	newChip.stroked = true;
	newChip.strokeColor = whiteColour();
	newChip.strokeWidth = 1 * units;
	newChip.strokeDashes = [];
	newChip.filled = true;
	newChip.fillColor = customColour(c,m,y,k);
	//----------------------------------------------------
	triangleMarker(xp,yp,whiteColour(),5*units,newChipGroup);
	chipNo(xp + (width/2),yp-height+(6*units),whiteColour(),newChipGroup,s)
	//----------------------------------------------------
}
//----------------------------------------------------
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
function chipNo(xp,yp,c,l,s){
	var chipNoTextFrame = l.textFrames.add();
	chipNoTextFrame.contents = s;
	chipNoTextFrame.top = yp
	chipNoTextFrame.left = xp
	//----------------------------------------------------
	if(valueLabels === true){
		chipNoTextFrame.textRange.characterAttributes.size = 3 * units;
	}else{
		chipNoTextFrame.textRange.characterAttributes.size = 4 * units;
	}
	//----------------------------------------------------
	chipNoTextFrame.textRange.characterAttributes.fillColor = c;
	chipNoTextFrame.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;
	chipNoTextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	//----------------------------------------------------
	if(valueLabels === true){
		chipNoTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');
		for(var r=0; r<3;r++){
			chipNoTextFrame.textRanges[r].characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Bold');
		}
	}
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
function userInput(c,m,y,k){
	userInputWindow = new Window ("dialog");
	//----------------------------------------------------
	infoGroup = userInputWindow.add ('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'left'
	infoText1 = infoGroup.add('statictext',undefined,infoTextInput1)
	infoText2 = infoGroup.add('statictext',undefined,infoTextInput2)
	infoText3 = infoGroup.add('statictext',undefined,infoTextInput3)
	infoText4 = infoGroup.add('statictext',undefined,infoTextInput4)
	infoText5 = infoGroup.add('statictext',undefined,infoTextInput5)
	infoText6 = infoGroup.add('statictext',undefined,infoTextInput6)
	//----------------------------------------------------
	inputWidth = 40;
	//----------------------------------------------------
	cmykValuesGroup = userInputWindow.add ('group');
	cmykValuesGroup.orientation = 'column'
	//----------------------------------------------------
	cmykValuesPanel = cmykValuesGroup.add ('panel',undefined,'CMYK Target Values', {borderStyle:'white'});
	cmykValuesPanel.orientation = 'column'
	cmykValuesPanelWidth = cmykValuesPanel.add ('group',[undefined,undefined,180,undefined],undefined, undefined);
	//----------------------------------------------------
	cGroup = cmykValuesPanel.add ('group');
	cGroup.orientation = 'row'
	cValueStatic = cGroup.add('statictext',undefined,'C:')
	cValueInput = cGroup.add('edittext',[undefined,undefined,inputWidth,18],c)
	cPerSymbol = cGroup.add('statictext',undefined,'%');
	//cGap = cmykValuesPanel.add ('panel',[0,0,0,18],undefined,{borderStyle:'white'});
	//----------------------------------------------------
	mGroup = cmykValuesPanel.add ('group');
	mGroup.orientation = 'row'
	mValueStatic = mGroup.add('statictext',undefined,'M:')
	mValueInput = mGroup.add('edittext',[undefined,undefined,inputWidth,18],m)
	mPerSymbol = mGroup.add('statictext',undefined,'%');
	//mGap = cmykValuesPanel.add ('panel',[0,0,0,18],undefined,{borderStyle:'white'});
	//----------------------------------------------------
	yGroup = cmykValuesPanel.add ('group');
	yGroup.orientation = 'row'
	yValueStatic = yGroup.add('statictext',undefined,'Y:')
	yValueInput = yGroup.add('edittext',[undefined,undefined,inputWidth,18],y)
	yPerSymbol = yGroup.add('statictext',undefined,'%');
	//yGap = cmykValuesPanel.add ('panel',[0,0,0,18],undefined,{borderStyle:'white'});
	//----------------------------------------------------
	kGroup = cmykValuesPanel.add ('group');
	kGroup.orientation = 'row'
	kValueStatic = kGroup.add('statictext',undefined,'K:')
	kValueInput = kGroup.add('edittext',[undefined,undefined,inputWidth,18],k)
	kPerSymbol = kGroup.add('statictext',undefined,'%');
	//----------------------------------------------------
	incrementsPanel = cmykValuesGroup.add ('panel',undefined,'Colour Adjustments', {borderStyle:'white'});
	incrementsPanel.orientation = 'column'
	incrementsPanel.alignChildren = 'left'
	//----------------------------------------------------
	incValueInputGroup = incrementsPanel.add ('group');
	incValueInputGroup.orientation = 'row'
	incPerSymbol = incValueInputGroup.add('statictext',undefined,'Increments: ');
	incValueInput = incValueInputGroup.add('edittext',[undefined,undefined,inputWidth,18],0)
	incPerSymbol = incValueInputGroup.add('statictext',undefined,'%');
	negativeCMYK = incrementsPanel.add ('RadioButton',undefined,'Less CMYK (each colour at once)');
	//negativeCMYK.value = true;
	positiveCMYK = incrementsPanel.add ('RadioButton',undefined,'More CMYK (each colour at once)');
	lighterCMYK = incrementsPanel.add ('RadioButton',undefined,'Less of each colour (separately)');
	darkerCMYK = incrementsPanel.add ('RadioButton',undefined,'More of each colour (separately)');
	cyan = incrementsPanel.add ('RadioButton',undefined,'+/- Cyan');
	magenta = incrementsPanel.add ('RadioButton',undefined,'+/- Magenta');
	yellow = incrementsPanel.add ('RadioButton',undefined,'+/- Yellow');
	key = incrementsPanel.add ('RadioButton',undefined,'+/- Key');
	//--------------------
	randomColour = incrementsPanel.add ('RadioButton',undefined,'Random Colours');
	//--------------------
	fourColourBlend = incrementsPanel.add ('RadioButton',undefined,'Blend Selected Four Squares');
	fourColourBlend.value = true;
	//----------------------------------------------------
	miscPanel = cmykValuesGroup.add ('panel',undefined,'Other', {borderStyle:'white'});
	miscPanel.orientation = 'column'
	miscPanel.alignChildren = 'left'
	valueLabelsButton = miscPanel.add ('Checkbox',undefined,'CMYK labels description');
	valueLabelsButton.value = true
	//----------------------------------------------------
	okButton = userInputWindow.add ('button',undefined,'OK');
	releaseInfo = userInputWindow.add('statictext',undefined,releaseInfoText)
	//----------------------------------------------------
	userInputWindow.show();
	stackChips = false;
	if(incValueInput.text <= 0){
		stackChips = false;
	}else{
		stackChips = true;
	}
	valueLabels = valueLabelsButton.value
	//----------------------------------------------------
	inC = parseFloat(cValueInput.text);
	inM = parseFloat(mValueInput.text);
	inY = parseFloat(yValueInput.text);
	inK = parseFloat(kValueInput.text);
	inInc = parseFloat(incValueInput.text);
	//----------------------------------------------------
	if(negativeCMYK.value == true){
		inCm = 0;
	}else if(positiveCMYK.value == true){
		inCm = 1
	}else if(lighterCMYK.value == true){
		inCm = 2
	}else if(darkerCMYK.value == true){
		inCm = 3
	}else if(cyan.value == true){
		inCm = 4
	}else if(magenta.value == true){
		inCm = 5
	}else if(yellow.value == true){
		inCm = 6
	}else if(key.value == true){
		inCm = 7
	}else if(randomColour.value == true){
		inCm = 8
		stackChips = true;
	}else if(fourColourBlend.value == true){
		inCm = 9
		stackChips = true;
	}else{
		inCm = 0;
	}
	//----------------------------------------------------
	return stackChips,inC,inM,inY,inK,inInc,inCm,valueLabels;
}
//----------------------------------------------------
function getSelectionColour(){//Single Colour
	selC = 0;
	selM = 0;
	selY = 0;
	selK = 0;
	//----------------------------------------------------
	if(app.activeDocument.selection.length > 0){
		if(app.activeDocument.selection[0].typename == 'CompoundPathItem'){
			selC = app.activeDocument.selection[0].pathItems[0].fillColor.cyan
			selM = app.activeDocument.selection[0].pathItems[0].fillColor.magenta
			selY = app.activeDocument.selection[0].pathItems[0].fillColor.yellow
			selK = app.activeDocument.selection[0].pathItems[0].fillColor.black
		}else if (app.activeDocument.selection[0].typename == 'PathItem'){
			selC = app.activeDocument.selection[0].fillColor.cyan
			selM = app.activeDocument.selection[0].fillColor.magenta
			selY = app.activeDocument.selection[0].fillColor.yellow
			selK = app.activeDocument.selection[0].fillColor.black
		}
	}
	//----------------------------------------------------
	selC = parseFloat(selC.toFixed(2))
	selM = parseFloat(selM .toFixed(2))
	selY = parseFloat(selY.toFixed(2))
	selK = parseFloat(selK.toFixed(2))
	//----------------------------------------------------
	return selC,selM,selY,selK;
}
//-------------------------------------------------------
function getSelectionColours(){
	if(app.activeDocument.selection.length > 3){
		//$.writeln('Looking for 4 colours')
		tempArray = app.activeDocument.selection
		//-------------------------------------------------------
		selectionCentre = boundsToXY(selectionSize(tempArray))
		//-------------------------------------------------------
		currentColourArray = [];
		for(c=0;c<tempArray.length;c++){
			currentColourArray.push({colour:selectedColours(tempArray[c]),
												position:relativePos(selectionCentre,
																			boundsToXY(visibleObjectBounds(tempArray[c]))
																			)})
			//$.writeln('Object: ' + boundsToXY(visibleObjectBounds(tempArray[c])))
		}
		//-------------------------------------------------------
		currentColourArray.sort(sortArray)
		//-------------------------------------------------------
		return currentColourArray
	}else{
		//$.writeln('Not enought items selected for 4 colour blend')
	}
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
function crosshair(x,y,s,l){ //development only
	/*
	//--------------------------------------------------------
	var scale = 1;
	var units = 72/25.4
	//--------------------------------------------------------
	function blackColour(){
		blackCMYK = new CMYKColor();
		blackCMYK.cyan = 0;
		blackCMYK.magenta = 0;
		blackCMYK.yellow = 0;
		blackCMYK.black = 100;
		return blackCMYK
	}
	*/
	//--------------------------------------------------------
	crosshairGroup = l.groupItems.add();
	crosshairGroup.name = 'Crosshair'
	//--------------------------------------------------------
	line = crosshairGroup.pathItems.add();
	line.setEntirePath([[x,-y+((s/2)*units)],[x,-y-((s/2)*units)]])
	line.filled = false;
	line.stroked = true;
	line.strokeColor = blackColour();
	line.strokeWidth = scale * units / 4;
	line.strokeDashes = [];
	//--------------------------------------------------------
	line.duplicate(crosshairGroup,ElementPlacement.PLACEATEND)
	crosshairGroup.pageItems[0].rotate(90,true,true,true,true,Transformation.CENTER);
	//--------------------------------------------------------
	return crosshairGroup;
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