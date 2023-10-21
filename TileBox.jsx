//------------------------------------
doSomething = false
userInput();
initialConstants();
if(doSomething === true){
	for(p=app.activeDocument.selection.length-1;p>=0;p--){
		tileBox(app.activeDocument.selection[p])
	}
}else{
	//do nothing
}
//------------------------------------
function tileBox(item){
	//------------------------------------
	tempMaxWidth = Math.round((maxWidth*units)*100)/100; //added to avoid tiling shapes of same width as max width allowed*/
	//------------------------------------
	totalWidth = neg2pos(item.geometricBounds[0] - item.geometricBounds[2]);
	totalHeight = neg2pos(item.geometricBounds[1] - item.geometricBounds[3]);
	//------------------------------------
	widthNestLength = (Math.ceil(totalWidth/tempMaxWidth))*totalHeight
	heightNestLength = (Math.ceil(totalHeight/tempMaxWidth))*totalWidth
	//------------------------------------
	switch(orientation){
		case 'vertical':
			tempOrientation = orientation;
			break;
		case 'horizontal':
			tempOrientation = orientation;
			break;
		case 'auto': 
			if(totalWidth <= tempMaxWidth){
				tempOrientation = 'vertical'
			}else if(totalHeight <= tempMaxWidth){
				tempOrientation = 'horizontal'
			}else{
				tempOrientation = 'vertical' //by default to tile vertically
			}
			break;
		case 'efficient':
			if(widthNestLength<heightNestLength){
				tempOrientation = 'vertical'
			}else{
				tempOrientation = 'horizontal'
			}
	}
	//------------------------------------
	if(tempOrientation === 'horizontal'){ //////////////////////////////////////////////////////////// HORIZONTAL
		tileNumber = tileNumberFunction(totalHeight,tempMaxWidth,overlap*units);
		tileWidth =  tileWidthFunction(totalHeight,tempMaxWidth,overlap*units);
		tileOverlap = overlap * units;
		shiftFactor = 0;
		//------------------------------------
		xp0 = item.geometricBounds[3]; // X Origin
		yp0 = item.geometricBounds[0]; // Y Origin
		yp1 = item.geometricBounds[2]; // Height
		//------------------------------------
		for(a=0;a<tileNumber;a++){
			//------------------------------------
			xp0 = xp0 + (shiftFactor)
			xp1 = xp0 + tileWidth;
			newRect = [yp1,xp1,yp0,xp0]//X0,Y0; X1,Y1 (left, top, right, bottom);
			//------------------------------------
			if(addTab === true){ 
				createTabTile(newRect,item,a,tileNumber)
			}else{
				createTile(newRect,item)
			}
			//------------------------------------
			shiftFactor = tileWidth - tileOverlap;
		}
	}else{ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// VERTICAL
		tileNumber = tileNumberFunction(totalWidth,tempMaxWidth,overlap*units);
		tileWidth =  tileWidthFunction(totalWidth,tempMaxWidth,overlap*units);
		tileOverlap = overlap * units;
		shiftFactor = 0;
		//------------------------------------
		xp0 = item.geometricBounds[0]; // X Origin
		yp0 = item.geometricBounds[1]; // Y Origin
		yp1 = item.geometricBounds[3]; // Height
		//------------------------------------
		for(a=0;a<tileNumber;a++){
			//------------------------------------
			xp0 = xp0 + (shiftFactor)
			xp1 = xp0 + tileWidth;
			newRect = [xp0,yp0,xp1,yp1]//X0,Y0; X1,Y1 (left, top, right, bottom);
			//------------------------------------
			if(addTab === true){
				createTabTile(newRect,item,a,tileNumber)
			}else{
				createTile(newRect,item)
			}
			//------------------------------------
			shiftFactor = tileWidth - tileOverlap;
		}
	}
	//------------------------------------
	if(removeSelectedBox === true){
		item.remove();
	}
}
//------------------------------------
function initialConstants(){
	units = (72/25.4)*scale;
}
//------------------------------------
function tileWidthFunction(totalWidth,maxWidth,overlap){
	return ((((Math.ceil(totalWidth/maxWidth))-1)*overlap)+totalWidth)/(Math.ceil(totalWidth/maxWidth));
}
//------------------------------------
function tileNumberFunction(totalWidth,maxWidth,overlap){
	return Math.ceil(totalWidth/maxWidth);
}
//------------------------------------
function createTile(rect,item){
	//----------------------------------------------------
	rectangleBounds = [[rect[0],rect[1]],
							[rect[2],rect[1]],
							[rect[2],rect[3]],
							[rect[0],rect[3]]
							]
	//----------------------------------------------------
	standardRectangle = item.parent.pathItems.add();
	standardRectangle.setEntirePath(rectangleBounds);
	standardRectangle.closed = true;
	if(item.typename === 'PathItem'){
		standardRectangle.filled = false; // IT DOES NOT TRANSFER FILL PROPERTY
		//standardRectangle.fillColor = item.fillColor;
		standardRectangle.stroked = item.stroked;
		standardRectangle.strokeColor = item.strokeColor;
		standardRectangle.strokeWidth = item.strokeWidth;
		standardRectangle.strokeDashes = item.strokeDashes;
	}else{
		standardRectangle.filled = false;
		standardRectangle.stroked = true;
		standardRectangle.strokeColor = blackColour();
		standardRectangle.strokeWidth = 1*units;
	}
}
//------------------------------------
function neg2pos(value){
	if(value < 0){
		value = value / -1;
	}
	return value;
}
//------------------------------------
function createTabTile(rect,item,currentTileNumber,totalTileNumber){
	//----------------------------------------------------
	tabWidth = 155 * units //155mm
	tabHeight = 20 * units //20mm
	currentTabShift = (tabShift(tileWidth,tabWidth,totalTileNumber)) * currentTileNumber
	//----------------------------------------------------
	if(tempOrientation === 'horizontal'){ //////////////////////////////////////////////////////////// HORIZONTAL
		if(currentTileNumber > 0 &&  currentTileNumber < (totalTileNumber-1)){//MIDDLE
			rectangleBounds = [[rect[0],rect[1]],
									[rect[2],rect[1]],
									[rect[2],rect[3]+(currentTabShift+tabWidth)],
									[rect[2]-tabHeight,rect[3]+(currentTabShift+tabWidth)],
									[rect[2]-tabHeight,rect[3]+(currentTabShift)],
									[rect[2],rect[3]+(currentTabShift)],
									[rect[2],rect[3]],
									[rect[0],rect[3]],
									]
		}
		if(currentTileNumber === (totalTileNumber-1)){//LAST
			rectangleBounds = [[rect[0],rect[1]],
									[rect[2]-tabHeight,rect[1]],
									[rect[2]-tabHeight,rect[1]-tabWidth],
									[rect[2],rect[1]-tabWidth],
									[rect[2],rect[3]],
									[rect[0],rect[3]]
									]
		}
		if(currentTileNumber === 0 || totalTileNumber === 1){//FIRST
			rectangleBounds = [[rect[0],rect[1]],
									[rect[2],rect[1]],
									[rect[2],rect[3]+tabWidth],
									[rect[2]-tabHeight,rect[3]+tabWidth],
									[rect[2]-tabHeight,rect[3]],
									[rect[0],rect[3]]
									]
		}
	}else{ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////// VERTICAL
		if(currentTileNumber > 0 &&  currentTileNumber < (totalTileNumber-1)){//MIDDLE
			rectangleBounds = [[rect[0],rect[1]],
									[rect[0]+currentTabShift,rect[1]],
									[rect[0]+currentTabShift,rect[1]+tabHeight],
									[rect[0]+tabWidth+currentTabShift,rect[1]+tabHeight],
									[rect[0]+tabWidth+currentTabShift,rect[1]],
									[rect[2],rect[1]],
									[rect[2],rect[3]],
									[rect[0],rect[3]]
									]
		}
		if(currentTileNumber === (totalTileNumber-1)){//LAST
			rectangleBounds = [[rect[0],rect[1]],
									[rect[2]-tabWidth,rect[1]],
									[rect[2]-tabWidth,rect[1]+tabHeight],
									[rect[2],rect[1]+tabHeight],
									[rect[2],rect[3]],
									[rect[0],rect[3]]
									]
		}
		if(currentTileNumber === 0 || totalTileNumber === 1){//FIRST
			rectangleBounds = [[rect[0],rect[1]+tabHeight],
									[rect[0]+tabWidth,rect[1]+tabHeight],
									[rect[0]+tabWidth,rect[1]],
									[rect[2],rect[1]],
									[rect[2],rect[3]],
									[rect[0],rect[3]]
									]
		}
	}
	//----------------------------------------------------	
	tabRectangle = item.parent.pathItems.add();
	tabRectangle.setEntirePath(rectangleBounds);
	tabRectangle.closed = true;
	if(item.typename === 'PathItem'){
		tabRectangle.filled = false; // IT DOES NOT TRANSFER FILL PROPERTY
		//tabRectangle.fillColor = item.fillColor;
		tabRectangle.stroked = item.stroked;
		tabRectangle.strokeColor = item.strokeColor;
		tabRectangle.strokeWidth = item.strokeWidth;
		tabRectangle.strokeDashes = item.strokeDashes;
	}else{
		tabRectangle.filled = false;
		tabRectangle.stroked = true;
		tabRectangle.strokeColor = blackColour();
		tabRectangle.strokeWidth = 1*units;
	}
				
	//--------------------------------------------------------------------------------------------------------------------- BARCODE
	if (addEskoBarcode === true){
		
		if(tempOrientation === 'vertical'){//////////////////////////////////////////////////////////// VERTICAL
			
			if(currentTileNumber > 0 &&  currentTileNumber < (totalTileNumber-1)){
				//MIDDLE
				bxp = rect[0]+currentTabShift
			}
			if(currentTileNumber === (totalTileNumber-1)){
				//LAST
				bxp = rect[2]-tabWidth
			}
			if(currentTileNumber === 0 || totalTileNumber === 1){ 
				//FIRST
				bxp = rect[0]
			}
	
			byp = rect[1]+tabHeight
			
			currentBarcode = createEskoBarcode(
									byp,
									bxp,
									tabWidth,
									tabHeight,
									item.parent,
									1)
									
		}else{//////////////////////////////////////////////////////////// HORIZONTAL
			
			if(currentTileNumber > 0 &&  currentTileNumber < (totalTileNumber-1)){
				//MIDDLE
				byp = rect[3]+currentTabShift
			}
			if(currentTileNumber === (totalTileNumber-1)){ 
				//LAST
				byp = rect[1]-tabWidth
			}
			if(currentTileNumber === 0 || totalTileNumber === 1){ 
				//FIRST
				byp = rect[3]
			}
	
			bxp = rect[2]-tabHeight
			
			currentBarcode = createEskoBarcode(
									byp,
									bxp,
									tabWidth,
									tabHeight,
									item.parent,
									1)
								
			currentBarcode.rotate(90,true,true,true,true,Transformation.TOPLEFT);
			
		}
	
	}
	//--------------------------------------------------------------------------------------------------------------------- BARCODE
}
//------------------------------------
function tabShift(tileWidth,tabWidth,tileNumber){
	return (tileWidth - tabWidth)/(tileNumber-1);
}
//------------------------------------
function blackColour(){
	blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK;
}
//------------------------------------
function cmykValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>100){
		v=100;
	}
	return v;
}
//------------------------------------
function customColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
}
//------------------------------------
function createEskoBarcode(x,y,w,h,l,s){
	
	var eskoBarcodeGroup = l.groupItems.add();
	eskoBarcodeGroup.name = 'Esko Barcode'
	white_background = roundedRect(x,y,eskoBarcodeGroup,w,h,5*units)
	
	s = units / (72/25.4)
	
	partcode_text = pointType('PARTCODE', y+(4.76 * units), x-(8.31 * units) , eskoBarcodeGroup , 14 * s)
	company_text = pointType('COMPANY', y+(4.76 * units),  x-(11.13 * units), eskoBarcodeGroup , 7 * s)
	company_text = pointType('LOCATION', y+(4.76 * units), x-(14.31 * units), eskoBarcodeGroup , 7 * s)
	barcode_text = pointType('*BARCODE*', y+(51.21 * units), x-(15.32 * units), eskoBarcodeGroup , 35.47 * s)

	return eskoBarcodeGroup
}
//------------------------------------
function roundedRect(x,y,l,w,h,r){
	roundedRectangle = l.pathItems.roundedRectangle(x,y,w,h,r,r,false)
	roundedRectangle.stroked = false
	roundedRectangle.filled = true
	roundedRectangle.fillColor = customColour(0,0,0,0)
	return roundedRectangle
}
//------------------------------------
function pointType(text,x,y,l,s){
	pointTextFrame = l.textFrames.add();
	pointTextFrame.contents = text;
	pointTextFrame.translate(x,y,true,true,true,true)
	pointTextFrame.textRange.characterAttributes.size = s;
	pointTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');//('ArialMT');
	pointTextFrame.textRange.characterAttributes.fillColor = customColour(0,0,0,100)
	pointTextFrame.textRange.paragraphAttributes.justification = Justification.LEFT;
	return pointTextFrame;
}
//------------------------------------
//------------------------------------
function userInput(){
	var w = new Window ('dialog', 'TileBox.jsx');
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//------------------------------------
	var orientationPanel = mainGroup.add('panel',undefined , 'Orientation', {borderStyle:'white'});
	orientationPanel.orientation = 'column'
	orientationPanel.alignChildren = 'left'
	var verticalOrientation = orientationPanel.add ("Radiobutton", undefined, 'Vertical');
	var horizontalOrientation = orientationPanel.add ("Radiobutton", undefined, 'Horizontal');
	var autoOrientation = orientationPanel.add ("Radiobutton", undefined, 'Auto');
	var efficientOrientation = orientationPanel.add ("Radiobutton", undefined, 'Efficient');
	autoOrientation.value = true;
	//------------------------------------
	var maxWidthPanel = mainGroup.add('panel',undefined , 'Max Width', {borderStyle:'white'});
	maxWidthPanel.orientation = 'row'
	var inputWidth = maxWidthPanel.add ("edittext", ([undefined,undefined,60,17]), '1290');
	var unitsText = maxWidthPanel.add ("statictext", undefined, 'mm');
	//------------------------------------
	var overlapPanel = mainGroup.add('panel',undefined , 'Overlap', {borderStyle:'white'});
	overlapPanel.orientation = 'row'
	var inputOverlap = overlapPanel.add ("edittext", ([undefined,undefined,60,17]), '10');
	var unitsText2 = overlapPanel.add ("statictext", undefined, 'mm');
	//------------------------------------
	var scalePanel = mainGroup.add('panel',undefined , 'Scale', {borderStyle:'white'});
	scalePanel.orientation = 'row'
	var unitsText = scalePanel.add ("statictext", undefined, 'Factor 1:');
	var inputScale = scalePanel.add ("edittext", ([undefined,undefined,30,21]), '10');
	//------------------------------------
	var miscPanel = mainGroup.add('panel',undefined , 'Misc', {borderStyle:'white'});
	miscPanel.orientation = 'column'
	miscPanel.alignChildren = 'left'
	var removeSelected = miscPanel.add ("checkbox", undefined, 'Remove current box');
	var addTabCheck = miscPanel.add ("checkbox", undefined, 'Add barcode tab');
	var addBarcodeCheck = miscPanel.add ("checkbox", undefined, 'Add esko barcode');
	removeSelected.value = true;
	addTabCheck.value = true;
	addBarcodeCheck.value = false;
	//------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		scale= 1/(parseInt(inputScale.text));
		overlap = parseFloat(inputOverlap.text);
		maxWidth  = parseFloat(inputWidth.text);
		doSomething = true;
		w.close();
	}
	w.show();
	//------------------------------------
	if(verticalOrientation.value === true){ 
		orientation = 'vertical';
	}
	if(horizontalOrientation.value === true){ 
		orientation = 'horizontal';
	}
	if(autoOrientation.value === true){ 
		orientation = 'auto';
	}
	if(efficientOrientation.value === true){ 
		orientation = 'efficient';
	}
	//------------------------------------
	if(removeSelected.value === true){ 
		removeSelectedBox = true;
	}else{
		removeSelectedBox = false;
	}
	//------------------------------------
	if(addTabCheck.value === true){ 
		addTab = true;
	}else{
		addTab = false;
	}
	//------------------------------------
	if(addBarcodeCheck.value === true){ 
		addEskoBarcode = true;
	}else{
		addEskoBarcode = false;
	}
	//------------------------------------
	return doSomething,maxWidth,overlap,scale,removeSelectedBox,addTab,addEskoBarcode,orientation;
}