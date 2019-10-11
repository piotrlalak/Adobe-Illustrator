//------------------------------------------
userInput();
initialConstants();
if(doSomething === true){
	if(app.activeDocument.selection.length>0){
		csvToBarcodes(app.activeDocument.selection);
	}else{
		//do nothing
	}
}else{
	//do nothing
}
//------------------------------------------
function csvToBarcodes(selection){
	if(selection.length === 1){//FIRST IF
		//------------------------------------------
		if(selection[0].typename === 'TextFrame'){//SECOND IF
			//------------------------------------------
			headerMatch = checkHeader(selection[0].contents);
			if(headerMatch === true){//THIRD IF
				//------------------------------------------
				barcodeCSVArray(selection[0].contents);
				if(barcodesArray === null){
					alert('Incorrect CSV structure','CSV Error');
				}else{
					//------------------------------------------
					checkCode39Font();
					if(fontBarcode === true){
						if(foundCode39Font === false){
						alert('Code39 font is missing.\nBarcodes will be creates as outlined bars.', 'Missing Font');
						}
					}
					//------------------------------------------
					tabsLocation = app.activeDocument.activeLayer;
					labelsLocation = app.activeDocument.activeLayer;
					if(createTabs === true && createLabels === true || autoDetect === true){
						tabsGroup = app.activeDocument.activeLayer.groupItems.add();
						tabsGroup.name = 'Tab Barcodes';
						labelsGroup = app.activeDocument.activeLayer.groupItems.add();
						labelsGroup.name = 'Label Barcodes';
						tabsLocation = tabsGroup;
						labelsLocation = labelsGroup;
					}
					//------------------------------------------
					tabsCounter = 0
					labelsCounter = 0
					//------------------------------------------
					for(g=0;g<barcodesArray.length;g++){
					//for(g=barcodesArray.length-1;g>=0;g--){
						if(autoDetect === true){//AUTODETECT
							//------------------------------------------
							if(barcodesArray[g].production == 'Print' || barcodesArray[g].production == 'PRINT'){
								xpT = selection[0].geometricBounds[0]
								ypT = (-(selection[0].geometricBounds[1]) + (20*units)) + ((tabsCounter)*(20+5)*units);
								completeStandardBarcode(barcodesArray[g].partcode,barcodesArray[g].description,barcodesArray[g].part,tabsLocation,xpT,ypT);
								tabsCounter++
							}else{
								xpL = selection[0].geometricBounds[0] + (25.5 * fullScaleUnits)
								ypL = (-(selection[0].geometricBounds[1])) + ((labelsCounter)*(29+5)*fullScaleUnits);
								barcodeLabel(barcodesArray[g].partcode,barcodesArray[g].description,barcodesArray[g].part,labelsLocation,xpL,ypL);
								labelsCounter++
							}
						}else{ //-------------------------------------------------------------------- CUSTOM LABELS
							//----------- TABS ----------- 
							if(createTabs === true){
								xpT = selection[0].geometricBounds[0]
								ypT = -(selection[0].geometricBounds[1]) + (20*units) + ((g)*(20+5)*units);
								completeStandardBarcode(barcodesArray[g].partcode,barcodesArray[g].description,barcodesArray[g].part,tabsLocation,xpT,ypT);
							}else{
								//do nothing
							}
							//----------- LABELS ----------- 
							if(createLabels === true){
								xpL = selection[0].geometricBounds[0]
								ypL = (-(selection[0].geometricBounds[1])) + ((g)*(29+5)*fullScaleUnits);
								barcodeLabel(barcodesArray[g].partcode,barcodesArray[g].description,barcodesArray[g].part,labelsLocation,xpL,ypL);
							}else{
								//do nothing
							}
						}//AUTODETECT
					}
					//------------------------------------------
					if(removeTextFrame === true){
						selection[0].remove();
					}else{
						selection[0].selected = false;
					}
				}
				//------------------------------------------
			}else{//THIRD IF
				alert('Selected TextFrame is incorrect','Selection Error');
			}
			//------------------------------------------
		}else{//SECOND IF
			//$.writeln('Selected type: ' + selection[0].typename);
			alert('Selected item is incompatible ','Selection Error');
		}	
	}else{//FIRST IF
		alert('Selection is empty or too large','Selection Error');
	}
	//------------------------------------------
	if(tabsGroup.pageItems.length < 1){
		tabsGroup.remove()
	}
	if(labelsGroup.pageItems.length < 1){
		labelsGroup.remove()
	}
}
//------------------------------------------
function checkHeader(csv){
	//------------------------------------------
	csvArray = csv.split("\r");
	activeHeaderColumns = csvArray[0];
	//------------------------------------------
	if(activeHeaderColumns===baseHeaderColumns){
		headerMatch = true;
	}else{
		headerMatch = false;
	}
	//------------------------------------------
	return headerMatch;
}
function barcodeCSVArray(csv){
	//------------------------------------------
	tempArray = csv.split('\r');
	tempArray = tempArray.toString();
	tempArray = tempArray.split(',')
	barcodesArray = null;
	//------------------------------------------
	barcodesArray = [];
	//------------------------------------------
	checkArrayHeader(tempArray)
	counter = 0;
	//------------------------------------------
	if(arrayHeaderMatch === true){
		for(f=5;f<tempArray.length-5;f++){
			barcodesArray[counter] = {partcode:tempArray[f], description:tempArray[(f+1)], part:tempArray[(f+2)], quantity:tempArray[(f+3)], production:tempArray[(f+4)]};
			f+=4
			counter++;
		}
	}else{
		barcodesArray = null;
	}
	//------------------------------------------
	return barcodesArray;
}
//------------------------------------------
function checkArrayHeader(array){
	//------------------------------------------
	testArrayHeaderString = array[0] + ',' + array[1] + ',' + array[2] + ',' + array[3] + ',' + array[4];
	//------------------------------------------
	if(testArrayHeaderString===baseHeaderColumns){
		arrayHeaderMatch = true;
	}else{
		arrayHeaderMatch = false;
	}
	//------------------------------------------
	return arrayHeaderMatch;
}
//------------------------------------------
function stringReplacement(a,b,c){//a-string, b- target, c-replacement
	//---------------------------------
	replacedString = '';
	//---------------------------------
	a = a.toString();
	b = b.toString();
	c = c.toString();
	//---------------------------------
	a = a.split('');
	b = b.split('');
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
/*---------------------------------------------------------------------------------------------
----------------------------------BARCODE LABELS----------------------------------
---------------------------------------------------------------------------------------------*/
function barcodeLabel(partcode,description,part,loc,x,y){
	//----------------------------------------------------
	completeBarcodeGroup = loc.groupItems.add();
	completeBarcodeGroup.name = partcode;
	//----------------------------------------------------
	if(addBleed === true){
		rectangleRounded(x-(5*fullScaleUnits),y+(29*fullScaleUnits)+(5*fullScaleUnits), 72*fullScaleUnits, 39*fullScaleUnits, 7*fullScaleUnits, completeBarcodeGroup,whiteColour(),false)
	}
	rectangleRounded(x,y+(29*fullScaleUnits), 62*fullScaleUnits, 29*fullScaleUnits, 2*fullScaleUnits, completeBarcodeGroup,whiteColour(),false)
	pathTextInfo(part,textBaseLine(completeBarcodeGroup,x+(2.5*fullScaleUnits),y+(14.5*fullScaleUnits),57*fullScaleUnits,0),7,Justification.CENTER,completeBarcodeGroup);//Part
	pathTextInfo(description,textBaseLine(completeBarcodeGroup,x+(2.5*fullScaleUnits),y+(11.5*fullScaleUnits),57*fullScaleUnits,0),7,Justification.CENTER,completeBarcodeGroup);//Description
	pathTextInfo(partcode,textBaseLine(completeBarcodeGroup,x+(2.5*fullScaleUnits),y+(8.5*fullScaleUnits),57*fullScaleUnits,0),15,Justification.CENTER,completeBarcodeGroup);//Main Partcode
	//----------------------------------------------------
	checkCode39Font();
	//----------------------------------------------------
	if(fontBarcode === true){
		if(foundCode39Font === true){
			barcodePathText(partcode,textBaseLine(completeBarcodeGroup,x+(2.5*fullScaleUnits),y+(24.5*fullScaleUnits),57*fullScaleUnits,0),8.52*fullScaleUnits,completeBarcodeGroup,0.735);//Main Barcode as Font
		}else{
			barcode(partcode,completeBarcodeGroup,57*fullScaleUnits,7.5*fullScaleUnits,x+(2.5*fullScaleUnits),y+(17*fullScaleUnits),0,0);//Main Barcode
		}	
	}else{
		barcode(partcode,completeBarcodeGroup,57*fullScaleUnits,7.5*fullScaleUnits,x+(2.5*fullScaleUnits),y+(17*fullScaleUnits),0,0);//Main Barcode
	}
	//----------------------------------------------------
	if(cutLines===true){
		rectangleRounded(x,y+(29*fullScaleUnits), 62*fullScaleUnits, 29*fullScaleUnits, 2*fullScaleUnits, completeBarcodeGroup,createSpotColour(cutName,cutValues),true);
	}
	//----------------------------------------------------
}
/*---------------------------------------------------------------------------------------------
------------------------------------BARCODE TABS------------------------------------
---------------------------------------------------------------------------------------------*/
function completeStandardBarcode(partcode,description,part,loc,x,y){
	//----------------------------------------------------
	completeBarcodeGroup = loc.groupItems.add();
	completeBarcodeGroup.name = partcode;
	//----------------------------------------------------
	if(addBleed === true){
		rectangleRounded(x-(5*units), y+(5*units), 165*units, 30*units, 10*units, completeBarcodeGroup,whiteColour(),false)
	}
	//----------------------------------------------------
	rectangleRounded(x, y, 155*units, 20*units, 5*units, completeBarcodeGroup,whiteColour(),false)
	pathTextInfo(part,textBaseLine(completeBarcodeGroup,x+(5*units),y-(5*units),50*units,0),7*scale,Justification.LEFT,completeBarcodeGroup);//Part
	pathTextInfo(description,textBaseLine(completeBarcodeGroup,x+(5*units),y-(8*units),50*units,0),7*scale,Justification.LEFT,completeBarcodeGroup);//Description
	pathTextInfo(partcode,textBaseLine(completeBarcodeGroup,x+(5*units),y-(11*units),50*units,0),15*scale,Justification.LEFT,completeBarcodeGroup);//Main Partcode
	//----------------------------------------------------
	checkCode39Font();
	//----------------------------------------------------
	if(fontBarcode === true){
		if(foundCode39Font === true){
			barcodePathText(partcode,textBaseLine(completeBarcodeGroup,x+(60*units),y-(5*units),90*units,0),11.37785869*units,completeBarcodeGroup,0.87);//Main Barcode as Font
		}else{
			barcode(partcode,completeBarcodeGroup,90*units,10*units,x+(60*units),y-(15*units),0,0);//Main Barcode
		}	
	}else{
		barcode(partcode,completeBarcodeGroup,90*units,10*units,x+(60*units),y-(15*units),0,0);//Main Barcode
	}
	//----------------------------------------------------
	if(cutLines===true){
		rectangleRounded(x, y, 155*units, 20*units, 5*units, completeBarcodeGroup,createSpotColour(cutName,cutValues),true);
	}
	//----------------------------------------------------
}
//--------------------------------------------------------------------------------------------------------
function barcode(barcodeString,loc,width,height,xp,yp,deg,bleed){
	//----------------------------------------------------
	barBgBleed = Math.sqrt(Math.pow(bleed,2) + Math.pow(bleed,2))
	xp = xp + (p2cX(barBgBleed,deg+45))
	yp = yp + (-p2cY(barBgBleed,deg+45))
	//----------------------------------------------------
	barcodeGroup = loc.groupItems.add();
	barcodeGroup.name = '*'+ barcodeString + '*';
	//----------------------------------------------------
	barcodeString = replaceUnknownChars(barcodeString)
	barWidth = width / ((barcodeString.split('').length * 15 ) + ( barcodeString.split('').length -1 ))
	charWidth = barWidth*15
	//----------------------------------------------------
	barcodeBounds = ([
							[xp,yp],//Point 0
							[(xp+(p2cX(width,deg))),-(-yp+(p2cY(width,deg)))],//Point 1
							[xp+p2cX(width,deg)+p2cX(height,deg-90),-(-yp+p2cY(width,deg)+p2cY(height,deg-90))],//Point 2
							[(xp+p2cX(height,deg-90)),-(-yp+p2cY(height,deg-90))] //Point 3
							]);
	//----------------------------------------------------
	for(a=0;a<(barcodeString.split('')).length;a++){
		//----------------------------------------------------
		newChart = chars(barcodeString[a],loc,charWidth,height,xp,yp,deg)
		newChart.move(barcodeGroup, ElementPlacement.PLACEATBEGINNING);
		//----------------------------------------------------
		xp = xp+(p2cX(charWidth,deg))
		yp = yp-(p2cY(charWidth,deg))
		//----------------------------------------------------
		if(a<(barcodeString.split('')).length-1){
			spaceBar = bars(loc,'0',barWidth,height,xp,yp,deg);
			spaceBar.name = 'Space';
			spaceBar.move(barcodeGroup, ElementPlacement.PLACEATBEGINNING);
		}
		//----------------------------------------------------
		xp = xp+(p2cX(barWidth,deg))
		yp = yp-(p2cY(barWidth,deg))
	}
	//----------------------------------------------------
	return barcodeGroup;
}
//----------------------------------------------------
function chars(character,loc,width,height,xp,yp,deg){
	charsGroup = loc.groupItems.add();
	charsGroup.name = character
	//----------------------------------------------------
	charBounds = ([
							[xp,yp],//Point 0
							[(xp+(p2cX(width,deg))),-(-yp+(p2cY(width,deg)))],//Point 1
							[xp+p2cX(width,deg)+p2cX(height,deg-90),-(-yp+p2cY(width,deg)+p2cY(height,deg-90))],//Point 2
							[(xp+p2cX(height,deg-90)),-(-yp+p2cY(height,deg-90))] //Point 3
							]);
	//----------------------------------------------------
	for(d=0;d<code39.length;d++){
		if(code39[d].chars === character){
			break;
		}
	}
	//----------------------------------------------------
	for (b=0;b<charBars;b++){
		newBar = bars(loc,((code39[d].bars).split(''))[b],barWidth,height,xp,yp,deg);
		newBar.move(charsGroup, ElementPlacement.PLACEATEND);
		xp = xp+(p2cX(barWidth,deg))
		yp = yp-(p2cY(barWidth,deg))
	}
	return charsGroup;
}
//----------------------------------------------------
function bars(loc,col,width,height,xp,yp,deg){//loc, colour, width, height, X position, Y position,degree
	barBounds = ([
							[xp,yp],//Point 0
							[(xp+(p2cX(width,deg))),-(-yp+(p2cY(width,deg)))],//Point 1
							[xp+p2cX(width,deg)+p2cX(height,deg-90),-(-yp+p2cY(width,deg)+p2cY(height,deg-90))],//Point 2
							[(xp+p2cX(height,deg-90)),-(-yp+p2cY(height,deg-90))] //Point 3
							]);
	var bar = loc.pathItems.add();
	bar.setEntirePath([
							[(barBounds[0][0]),-(barBounds[0][1])],
							[(barBounds[1][0]),-(barBounds[1][1])],
							[(barBounds[2][0]),-(barBounds[2][1])],
							[(barBounds[3][0]),-(barBounds[3][1])]
							])
	
	bar.closed = true;
	bar.stroked = false;
	bar.filled - true;
	if (col === '0'){
		bar.fillColor = whiteColour()
	}else{
		bar.fillColor = blackColour()
	}
	return bar;
}
//----------------------------------------------------
function whiteColour(){
	whiteCMYK = new CMYKColor();
	whiteCMYK.cyan = 0;
	whiteCMYK.magenta = 0;
	whiteCMYK.yellow = 0;
	whiteCMYK.black = 0;
	return whiteCMYK;
}
//----------------------------------------------------
function blackColour(){
	blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK;
}
//----------------------------------------------------
function p2cX(length,angle){ //polar to cartesian
	p2cX = length * Math.cos(d2r(angle))
	return p2cX;
}
//----------------------------------------------------
function p2cY(length,angle){ //polar to cartesian
	p2cY = length * Math.sin(d2r(angle))
	return p2cY;
}
//----------------------------------------------------
function c2pL(x,y){ //cartesian to polar
	c2pL = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	return c2pL;
}
//----------------------------------------------------
function c2pA(x,y){ //cartesian to polar
	c2pA = r2d(Math.atan(y/x))
	return c2pA;
}
//----------------------------------------------------
function r2d(rad){ //radians to degrees
	r2dDeg = (rad * 180) / Math.PI;
	return r2dDeg;
}
//----------------------------------------------------
function d2r(deg){ //degrees to radians
	d2rRad = deg * (Math.PI / 180);
	return d2rRad;
}
//----------------------------------------------------
function losASA(degA,degB,side){ //Law of Sines ASA calculation - side and two adjacent angles
	side = side * (r2d(Math.sin(d2r(degA))) / r2d(Math.sin(d2r(degC))))
	return side;
}
//----------------------------------------------------
function initialConstants(){
	currentDate = new Date()
	//$.writeln('\nCSVtoBarcodes.jsx  |  ' + currentDate + '\n.............................................')
	baseHeaderColumns = 'PARTCODE,DESCRIPTION,LOCATION,QUANTITY,PRODUCTION';
	scale = 1/scaleFactorInput; //input scale to be added
	units = (72/25.4)*scale; //constant conversion rate between points and milimeters
	fullScaleUnits = (72/25.4);
	charBars = 15
	code39 = [{chars:'A', bars:'111010100010111'},{chars:'B', bars:'101110100010111'},{chars:'C', bars:'111011101000101'},
					{chars:'D', bars:'101011100010111'},{chars:'E', bars:'111010111000101'},{chars:'F', bars:'101110111000101'},
					{chars:'G', bars:'101010001110111'},{chars:'H', bars:'111010100011101'},{chars:'I', bars:'101110100011101'},
					{chars:'J', bars:'101011100011101'},{chars:'K', bars:'111010101000111'},{chars:'L', bars:'101110101000111'},
					{chars:'M', bars:'111011101010001'},{chars:'N', bars:'101011101000111'},{chars:'O', bars:'111010111010001'},
					{chars:'P', bars:'101110111010001'},{chars:'Q', bars:'101010111000111'},{chars:'R', bars:'111010101110001'},
					{chars:'S', bars:'101110101110001'},{chars:'T', bars:'101011101110001'},{chars:'U', bars:'111000101010111'},
					{chars:'V', bars:'100011101010111'},{chars:'W', bars:'111000111010101'},{chars:'X', bars:'100010111010111'},
					{chars:'Y', bars:'111000101110101'},{chars:'Z', bars:'100011101110101'},{chars:'0', bars:'101000111011101'},
					{chars:'1', bars:'111010001010111'},{chars:'2', bars:'101110001010111'},{chars:'3', bars:'111011100010101'},
					{chars:'4', bars:'101000111010111'},{chars:'5', bars:'111010001110101'},{chars:'6', bars:'101110001110101'},
					{chars:'7', bars:'101000101110111'},{chars:'8', bars:'111010001011101'},{chars:'9', bars:'101110001011101'},
					{chars:'*', bars:'100010111011101'},{chars:' ', bars:'100011101011101'},{chars:'-', bars:'100010101110111'},
					{chars:'$', bars:'100010001000101'},{chars:'%', bars:'101000100010001'},{chars:'.', bars:'111000101011101'},
					{chars:'/', bars:'100010001010001'},{chars:'+', bars:'100010100010001'}]
					//each character has 15 thin bars each; space between each character to be 1 bar thick
	barWidthAt100 = 0.7*scale  // 0.787109375 is exact
}
//----------------------------------------------------
function replaceUnknownChars(barcodeString){
	barcodeString = '*' + barcodeString.toUpperCase() + '*';
	outputString = '';
	for(a=0;a<barcodeString.split('').length;a++){
		for(b=0;b<code39.length;b++){
			if(barcodeString.split('')[a] === code39[b].chars){
				outputString = outputString + barcodeString.split('')[a];
				break;
			}else if(b === code39.length-1){
				outputString = outputString + 'X';
				break;
			}
		}
	}
	return outputString;
}
//----------------------------------------------------
function crosshair(x,y,s,l){ //development only
	crosshairGroup = l.groupItems.add();
	crosshairGroup.name = 'Crosshair'
	vLine = crosshairGroup.pathItems.add();
	vLine.setEntirePath([[x,-y+((s/2)*units)],[x,-y-((s/2)*units)]])
	vLine.filled = false;
	vLine.stroked = true;
	vLine.strokeColor = blackColour();
	vLine.strokeWidth = scale * units / 4;
	vLine.strokeDashes = [];
	hLine = crosshairGroup.pathItems.add();
	hLine.setEntirePath([[x+((s/2)*units),-y],[x-((s/2)*units),-y]])
	hLine.filled = false;
	hLine.stroked = true;
	hLine.strokeColor = blackColour();
	hLine.strokeWidth = scale * units / 4;
	hLine.strokeDashes = [];
	return crosshairGroup;
}
//----------------------------------------------------
function barcodePathText(text,path,size,loc,cwidth){
	barcodeTextFrame = loc.textFrames.pathText(path);
	barcodeTextFrame.contents = replaceUnknownChars(text);// '*'+text+'*';
	barcodeTextFrame.textRange.characterAttributes.size = size;
	//----------------------------------------------------
	barsNo = (((barcodeTextFrame.contents).length)*15) + ((barcodeTextFrame.contents).length-1)
	maxBarcodeWidth = 90*units;
	currentBarcodeWidth = barsNo*barWidthAt100
	barcodeTextFrame.textRange.characterAttributes.horizontalScale = (((maxBarcodeWidth * 100) / currentBarcodeWidth))*cwidth; //100
	//----------------------------------------------------
	barcodeTextFrame.paragraphs[0].paragraphAttributes.justification = Justification.CENTER
	barcodeTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('Code3de9');
	return barcodeTextFrame;
}
//----------------------------------------------------
function pathTextInfo(text,path,size,just,loc){
	pathTextFrame = loc.textFrames.pathText(path);
	pathTextFrame.contents = text;
	pathTextFrame.textRange.characterAttributes.size = size;
	pathTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('ArialMT');
	pathTextFrame.textRange.paragraphAttributes.justification = just//Justification.LEFT;
	return pathTextFrame;
}
//----------------------------------------------------
function pointTextInfo(text,xp,yp,size,loc){
	pointTextFrame = loc.textFrames.add();
	pointTextFrame.contents = text;
	pointTextFrame.top = yp;
	pointTextFrame.left = xp;
	pointTextFrame.textRange.characterAttributes.size = size;
	pointTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('ArialMT');
	return pointTextFrame;
}
//----------------------------------------------------
function header(c,s,loc,xp,yp,width,bleed,deg){
	headerGroup = loc.groupItems.add();
	headerGroup.name = 'Header'
	//----------------------------------------------------
	baselineOffset = width + bleed;
	baselineWidth = 55 * units;
	//----------------------------------------------------
	headerBaseline1 = [xp+(p2cX(baselineOffset,deg))+(p2cX(2.5*units,deg-90)),yp-(p2cY(baselineOffset,deg))-(p2cY(2.5*units,deg-90))];
	headerBaseline2 = [xp+(p2cX(baselineOffset,deg))+(p2cX(6.25*units,deg-90)),yp-(p2cY(baselineOffset,deg))-(p2cY(6.25*units,deg-90))];
	headerBaseline3 = [xp+(p2cX(baselineOffset,deg))+(p2cX(10*units,deg-90)),yp-(p2cY(baselineOffset,deg))-(p2cY(10*units,deg-90))];
	//----------------------------------------------------
	baseline1 = textBaseLine(headerGroup,headerBaseline1[0],headerBaseline1[1],baselineWidth,deg);
	baseline2 = textBaseLine(headerGroup,headerBaseline2[0],headerBaseline2[1],baselineWidth,deg);
	baseline3 = textBaseLine(headerGroup,headerBaseline3[0],headerBaseline3[1],baselineWidth,deg);
	//----------------------------------------------------
	headerCode = headerGroup.textFrames.pathText(baseline1);
	headerDescription1 = headerGroup.textFrames.pathText(baseline2);
	headerDescription2 = headerGroup.textFrames.pathText(baseline3);
	//----------------------------------------------------
	headerCode.contents = c;
	headerDescription1.contents = s;
	headerDescription1.nextFrame = headerDescription2;
	//----------------------------------------------------
	headerCode.textRange.characterAttributes.size = 10 * scale; //10points
	headerCode.textRange.characterAttributes.fillColor = blackColour();
	headerCode.textRange.paragraphAttributes.justification = Justification.CENTER;
	//----------------------------------------------------
	headerDescription1.textRange.characterAttributes.size = 10 * scale; //10points
	headerDescription1.textRange.characterAttributes.fillColor = blackColour();
	headerDescription1.textRange.paragraphAttributes.justification = Justification.CENTER;
	//----------------------------------------------------
	headerDescription2.textRange.characterAttributes.size = 10 * scale; //10points
	headerDescription2.textRange.characterAttributes.fillColor = blackColour();
	headerDescription2.textRange.paragraphAttributes.justification = Justification.CENTER;
	//----------------------------------------------------
	return headerGroup;
}
//----------------------------------------------------
function textBaseLine(loc,xp,yp,width,deg){
	textBaseLinePath = loc.pathItems.add();
	textBaseLineCoordinates = ([
							[xp,-yp],
							[(xp+(p2cX(width,deg))),-yp+(p2cY(width,deg))]
							])
	textBaseLinePath.setEntirePath([[textBaseLineCoordinates[0][0],textBaseLineCoordinates[0][1]],
											[textBaseLineCoordinates[1][0],textBaseLineCoordinates[1][1]]
											])
	textBaseLinePath.filled = false;
	textBaseLinePath.stroked = true;
	textBaseLinePath.strokeColor = blackColour();
	textBaseLinePath.strokeWidth = scale * units / 4;
	textBaseLinePath.strokeDashes = [];
	return textBaseLinePath;
}
//----------------------------------------------------
function handleLength(radius,deg){ //anchor handle length
	return radius  * ((Math.SQRT2 - 1)/3)*(360/deg);
}
//----------------------------------------------------
function rectangleRounded(xp,yp,width,height,radius,loc,colour,stroke){
	//----------------------------------------------------
	yp = yp / -1;
	//----------------------------------------------------
	rectangleBounds = [[xp,yp+radius],[xp,yp+height-radius],[xp+radius,yp+height],[xp+width-radius,yp+height],
								[xp+width,yp+height-radius],[xp+width,yp+radius],[xp+width-radius,yp],[xp+radius,yp]];
	//----------------------------------------------------
	roundedRectangle = loc.pathItems.add();
	roundedRectangle.setEntirePath(rectangleBounds);
	roundedRectangle.closed = true;
	if(stroke === false){
		roundedRectangle.stroked = false;
		roundedRectangle.filled = true;
		roundedRectangle.fillColor = colour;
	}else{
		roundedRectangle.filled = false;
		roundedRectangle.stroked = true;
		roundedRectangle.strokeColor = colour;
		roundedRectangle.strokeWidth = 0.25 * units;
		roundedRectangle.strokeDashes = [];
	}
	//----------------------------------------------------
	roundPathPoint(roundedRectangle.pathPoints[0],radius,'t');
	roundPathPoint(roundedRectangle.pathPoints[1],radius,'t');
	roundPathPoint(roundedRectangle.pathPoints[2],radius,'r');
	roundPathPoint(roundedRectangle.pathPoints[3],radius,'r');
	roundPathPoint(roundedRectangle.pathPoints[4],radius,'b');
	roundPathPoint(roundedRectangle.pathPoints[5],radius,'b');
	roundPathPoint(roundedRectangle.pathPoints[6],radius,'l');
	roundPathPoint(roundedRectangle.pathPoints[7],radius,'l');
	//----------------------------------------------------
	return roundedRectangle;
}
//----------------------------------------------------
function roundPathPoint(pathPoint,radius,orientation){
	switch(orientation){
		case 't':
			pathPoint.leftDirection = [pathPoint.anchor[0],pathPoint.anchor[1]-handleLength(radius,90)]
			pathPoint.rightDirection = [pathPoint.anchor[0],pathPoint.anchor[1]+handleLength(radius,90)]
			break;
		case 'b':
			pathPoint.leftDirection = [pathPoint.anchor[0],pathPoint.anchor[1]+handleLength(radius,90)]
			pathPoint.rightDirection = [pathPoint.anchor[0],pathPoint.anchor[1]-handleLength(radius,90)]
			break;
		case 'l':
			pathPoint.leftDirection = [pathPoint.anchor[0]+handleLength(radius,90),pathPoint.anchor[1]]
			pathPoint.rightDirection = [pathPoint.anchor[0]-handleLength(radius,90),pathPoint.anchor[1]]
			break;
		case 'r':
			pathPoint.leftDirection = [pathPoint.anchor[0]-handleLength(radius,90),pathPoint.anchor[1]]
			pathPoint.rightDirection = [pathPoint.anchor[0]+handleLength(radius,90),pathPoint.anchor[1]]
			break;
		default:
			break;
	}
}
//----------------------------------------------------
function checkCode39Font(){
	//----------------------------------------------------
	foundCode39Font = false
	//----------------------------------------------------
	for(f=0;f<app.textFonts.length;f++){
		if(app.textFonts[f].name === 'Code3de9'){
			foundCode39Font = true
			break;
		}
	}
	//----------------------------------------------------
	if(foundCode39Font === false){
	}
	//----------------------------------------------------
	return foundCode39Font;
}
//---------------------------------------------------------------------
function createSpotColour(spotColourName,spotColourValues){
	checkSpot(spotColourName);	
	if(isSpotColour === false){
		currentSpotColour = customSpotColour(spotColourName,spotColourValues)
	}else{
		for(s=0;s<app.activeDocument.spots.length;s++){
			if(app.activeDocument.spots[s].name === spotColourName){
				customCMYKSpotColour = new SpotColor();
				customCMYKSpotColour.spot = app.activeDocument.spots[s];
				customCMYKSpotColour.tint = 100;
				currentSpotColour = customCMYKSpotColour;
			}
		}
	}
	return currentSpotColour;
}
//---------------------------------------------------------------------
function checkSpot(checkSpotName){
	for(a=0;a<app.activeDocument.spots.length;a++){
		if(app.activeDocument.spots[a].name === checkSpotName){
			isSpotColour = true;
			break;
		}else{
			isSpotColour = false;
		}
	}
	return isSpotColour;
}
//---------------------------------------------------------------------
function customSpotColour(name,cmykValues){
	//---------------------------------------------------------------------
	customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValues[0];
	customCMYK.magenta = cmykValues[1];
	customCMYK.yellow = cmykValues[2];
	customCMYK.black = cmykValues[3];
	//---------------------------------------------------------------------
	customCMYKSpot = app.activeDocument.spots.add();
	customCMYKSpot.name = name ;
	customCMYKSpot.colorType = ColorModel.SPOT;
	customCMYKSpot.color = customCMYK;
	//---------------------------------------------------------------------
	customCMYKSpotColour = new SpotColor();
	customCMYKSpotColour.spot = customCMYKSpot;
	customCMYKSpotColour.tint = 100;
	//---------------------------------------------------------------------
	return customCMYKSpotColour;	
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"CSV to Barcodes");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	var barcodeTypeGroup = mainGroup.add ('group');
	barcodeTypeGroup.orientation = 'row'
	barcodeTypeGroup.alignChildren = 'center'
	autoCheck = barcodeTypeGroup.add ("checkbox", undefined, 'Auto-detect');
	autoCheck.value = true;
		barcodeCustomTypeGroup = barcodeTypeGroup.add('group');
		tabCheck = barcodeCustomTypeGroup.add ("checkbox", undefined, 'Tabs');
		tabCheck.value = true;
		labelCheck = barcodeCustomTypeGroup.add ("checkbox", undefined, 'Labels');
		labelCheck.value = false;
		barcodeCustomTypeGroup.enabled = false
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var fontTypeGroup = mainGroup.add ('group');
	fontTypeGroup.orientation = 'row'
	fontTypeGroup.alignChildren = 'center'
	fontTypeRadio = fontTypeGroup.add ("RadioButton", undefined, 'Font');
	fontTypeRadio.value = true;
	barsTypeRadio = fontTypeGroup.add ("RadioButton", undefined, 'Bars');
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var scaleGroup = mainGroup.add ('group');
	scaleGroup.orientation = 'row'
	scaleGroup.alignChildren = 'center'
	scaleInfo = scaleGroup.add ("statictext", undefined, 'Scale 1:');
	scaleInput = scaleGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
	//----------------------------------------------------
	divider3 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	othersGroup = mainGroup.add ('group');
	othersGroup.orientation = 'column'
	othersGroup.alignChildren = 'left'
		removeBox = othersGroup.add ("checkbox", undefined, 'Remove selected CSV text frame');
		removeBox.value = true;
		cutMainGroup = othersGroup.add ('group');
		cutMainGroup.orientation = 'row'
		cutMainGroup.alignChildren = 'center'
			cutBox = cutMainGroup.add ("checkbox", undefined, 'Cut');
			cutBox.value = false;
			cutTypeGroup = cutMainGroup.add ('group');
			cutTypeGroup.orientation = 'row'
			cutTypeGroup.alignChildren = 'center'
				fullCutRadio = cutTypeGroup.add ("RadioButton", undefined, 'Full Cut');
				fullCutRadio.value = true;
				kissCutRadio = cutTypeGroup.add ("RadioButton", undefined, 'Kiss Cut');
			cutTypeGroup.enabled = false;
		bleedBox = othersGroup.add ("checkbox", undefined, 'Bleed (Background)');
		bleedBox.value = false;
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Generate");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	//----------------------------------------------------
	autoCheck.onClick = function (){
		if(barcodeCustomTypeGroup.enabled === true){
			barcodeCustomTypeGroup.enabled = false;
		}else{
			barcodeCustomTypeGroup.enabled = true;
		}
	}
	//----------------------------------------------------
	cutBox.onClick = function (){
		if(cutTypeGroup.enabled === true){
			cutTypeGroup.enabled = false;
		}else{
			cutTypeGroup.enabled = true;
		}
	}
	//----------------------------------------------------
	w.show();
	//----------------------------------------------------
	if(fontTypeRadio.value === true){
		fontBarcode = true;
		fontTypeRadio.value = true
		barsTypeRadio.value = false
	}else{
		fontBarcode = false;
		fontTypeRadio.value = false
		barsTypeRadio.value = true
	}
	//----------------------------------------------------
	if(fullCutRadio.value === true){
		cutMode= 0;
		cutName = 'CutContourFullCut'
		cutValues = [0,99,0,0];
		fullCutRadio.value = true;
		kissCutRadio.value = false;
	}else{
		cutMode= 1;
		cutName = 'CutContourKissCut'
		cutValues = [99,0,0,0];
		fullCutRadio.value = false;
		kissCutRadio.value = true;
	}
	//----------------------------------------------------
	if(autoCheck.value === true){
		autoDetect = true
		createTabs = false
		createLabels = false
	}else{
		autoDetect = false
		createTabs = tabCheck.value
		createLabels = labelCheck.value
	}
	cutLines = cutBox.value;
	addBleed = bleedBox.value;
	//----------------------------------------------------
	scaleFactorInput  = parseFloat(scaleInput.text);
	removeTextFrame = removeBox.value;
	//----------------------------------------------------
	return autoDetect,createTabs,createLabels,cutLines,fontBarcode,scaleFactorInput,removeTextFrame,addBleed;
}