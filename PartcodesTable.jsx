//----------------------------------------------------
units = 72/25.4
userInput()
if(doSomething === true){
	if(selection.length===1){
		partcodesTable()
	}
}else{
	//donothing
}
//----------------------------------------------------
function partcodesTable(){
	
	//----------------------------- INIT VARS
	
	tableX_init = 34.26575
	tableY_init = 124.97534
	//itemRow_height = 4.895 * units
	active_lay = app.activeDocument.activeLayer
	active_art = app.activeDocument.artboards[app.activeDocument.artboards.getActiveArtboardIndex()]
	xOrigin = active_art.artboardRect[0] + tableX_init
	yOrigin = active_art.artboardRect[1] - tableY_init
	
	//----------------------------- PREFLIGHT CHECKS
	textframe_length = Boolean(selection.length === 1)
	headerMatch = checkHeader(selection[0].contents);
	if(textframe_length == true && headerMatch == true){
		partcodesArray = partcodeCSVArray(selection[0].contents);
		newTableGroup = active_lay.groupItems.add();
		newTableGroup.name = 'PartcodesTable'
	}else{
		partcodesArray = null
	}
	//----------------------------- MAIN LOOP
	//{partcode:tempArray[f], description:tempArray[(f+1)], part:tempArray[(f+2)], quantity:tempArray[(f+3)], production:tempArray[(f+4)]};
	if(partcodesArray != null){
		for(i=0;i<partcodesArray.length;i++){
			itemRow(xOrigin,
					yOrigin,
					newTableGroup,
					partcodesArray[i].production,
					partcodesArray[i].part,
					partcodesArray[i].partcode,
					partcodesArray[i].quantity)	
			yOrigin = yOrigin - itemRow_height
		}
	}
}
//----------------------------------------------------

function itemRow(x,y,l,t,d_text,p_text,no_text){
	newItemGroup = l.groupItems.add();
	newItemGroup.name = p_text
	//----------------------------------------------------
	
	type_box_width = 3.383 * units
	desc_box_width = 31.8 * units
	part_box_width = 21.6 * units
	nore_box_width = 14.912 * units
	chec_box_width = 10.65 * units
	stroke_width = 0.176 * units
	
	if(itemRow_height <= (2*units)){
		s = ((itemRow_height / units) * 0.8 ) * units
	}else{
		s = 1.426 * units
	}
	
	vShift = (-10.043952) + (s/2) - (0.046753613 * (s / (72/25.4))) + (itemRow_height/2)

	text_height = s*1.483459427384661
	text_offset = vShift

	stroke_colour = customColour(0,0,0,85)
	type_die_colour = customColour(0,100,0,0)
	type_kiss_colour = customColour(100,0,0,0)
	type_other_colour = customColour(100,0,100,0)
	base_colour = customColour(0,0,0,0)
	
	//---------------------------------------------------- TYPE BOX
	
	type_box = newItemGroup.pathItems.add(x,y,type_box_width,itemRow_height,false,false);
	type_box.setEntirePath([[x,y],[x+type_box_width,y],[x+type_box_width,y-itemRow_height],[x,y-itemRow_height]]);
	type_box.closed = true;
	type_box.stroked = true;
	type_box.strokeColor = stroke_colour;
	type_box.strokeWidth = stroke_width;
	type_box.strokeDashes = [];
	type_box.filled = true;
	switch(t){
		case 'PRINT':
			type_box.fillColor = type_die_colour;
			break;
		case 'Print':
			type_box.fillColor = type_die_colour;
			break;
		case 'CUT':
			type_box.fillColor = type_kiss_colour;
			break;
		case 'Cut':
			type_box.fillColor = type_kiss_colour;
			break;
		default:
			type_box.fillColor = type_other_colour;
	}

	x = x + type_box_width

	//---------------------------------------------------- DESCRIPTION BOX

	desc_box = newItemGroup.pathItems.add(x,y,desc_box_width,itemRow_height,false,false);
	desc_box.setEntirePath([[x,y],[x+desc_box_width,y],[x+desc_box_width,y-itemRow_height],[x,y-itemRow_height]]);
	desc_box.closed = true;
	desc_box.stroked = true;
	desc_box.strokeColor = stroke_colour;
	desc_box.strokeWidth = stroke_width;
	desc_box.strokeDashes = [];
	desc_box.filled = true;
	desc_box.fillColor = base_colour;
	
	desc_TextFrame = newItemGroup.textFrames.add();
	desc_TextFrame.contents = d_text;
	desc_TextFrame.top = y-text_offset
	desc_TextFrame.left = x+(desc_box_width/2)
	desc_TextFrame.textRange.characterAttributes.size = text_height;
	desc_TextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	desc_TextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');
	
	x = x + desc_box_width
	
	//---------------------------------------------------- PARTCODE BOX

	part_box = newItemGroup.pathItems.add(x,y,part_box_width,itemRow_height,false,false);
	part_box.setEntirePath([[x,y],[x+part_box_width,y],[x+part_box_width,y-itemRow_height],[x,y-itemRow_height]]);
	part_box.closed = true;
	part_box.stroked = true;
	part_box.strokeColor = stroke_colour;
	part_box.strokeWidth = stroke_width;
	part_box.strokeDashes = [];
	part_box.filled = true;
	part_box.fillColor = base_colour;
	
	part_TextFrame = newItemGroup.textFrames.add();
	part_TextFrame.contents = p_text;
	part_TextFrame.top = y-text_offset
	part_TextFrame.left = x+(part_box_width/2)
	part_TextFrame.textRange.characterAttributes.size = text_height;
	part_TextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	part_TextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');
	
	x = x + part_box_width
	
	//---------------------------------------------------- NO's REQ BOX

	nore_box = newItemGroup.pathItems.add(x,y,nore_box_width,itemRow_height,false,false);
	nore_box.setEntirePath([[x,y],[x+nore_box_width,y],[x+nore_box_width,y-itemRow_height],[x,y-itemRow_height]]);
	nore_box.closed = true;
	nore_box.stroked = true;
	nore_box.strokeColor = stroke_colour;
	nore_box.strokeWidth = stroke_width;
	nore_box.strokeDashes = [];
	nore_box.filled = true;
	nore_box.fillColor = base_colour;
	
	nore_TextFrame = newItemGroup.textFrames.add();
	nore_TextFrame.contents = no_text;
	nore_TextFrame.top = y-text_offset
	nore_TextFrame.left = x+(nore_box_width/2)
	nore_TextFrame.textRange.characterAttributes.size = text_height;
	nore_TextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	nore_TextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Regular');
	
	x = x + nore_box_width
	
	//---------------------------------------------------- CHECKED BOX

	chec_box = newItemGroup.pathItems.add(x,y,chec_box_width,itemRow_height,false,false);
	chec_box.setEntirePath([[x,y],[x+chec_box_width,y],[x+chec_box_width,y-itemRow_height],[x,y-itemRow_height]]);
	chec_box.closed = true;
	chec_box.stroked = true;
	chec_box.strokeColor = stroke_colour;
	chec_box.strokeWidth = stroke_width;
	chec_box.strokeDashes = [];
	chec_box.filled = true;
	chec_box.fillColor = base_colour;

}
//------------------------------------------
function checkHeader(csv){
	//------------------------------------------
	csvArray = csv.split("\r");
	activeHeaderColumns = csvArray[0];
	baseHeaderColumns = 'PARTCODE,DESCRIPTION,LOCATION,QUANTITY,PRODUCTION';
	//------------------------------------------
	if(activeHeaderColumns===baseHeaderColumns){
		headerMatch = true;
	}else{
		headerMatch = false;
	}
	//------------------------------------------
	return headerMatch;
}
//------------------------------------------
function partcodeCSVArray(csv){
	//------------------------------------------
	tempArray = csv.split('\r');
	tempArray = tempArray.toString();
	tempArray = tempArray.split(',')
	partcodesArray = null;
	//------------------------------------------
	partcodesArray = [];
	//------------------------------------------
	checkArrayHeader(tempArray)
	counter = 0;
	//------------------------------------------
	if(arrayHeaderMatch === true){
		for(f=5;f<tempArray.length-5;f++){
			partcodesArray[counter] = {partcode:tempArray[f], description:tempArray[(f+1)], part:tempArray[(f+2)], quantity:tempArray[(f+3)], production:tempArray[(f+4)]};
			f+=4
			counter++;
		}
	}else{
		partcodesArray = null;
	}
	//------------------------------------------
	return partcodesArray;
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
//----------------------------------------------------
function boundsToXY(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			-bounds[1] - ((bounds[3] - bounds[1])/2)
			]
	return xy;
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
function blackColour(){
	var blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK;
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
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"PartcodesTable");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create partcodes table');
		info2 = infoGroup.add ("statictext", undefined,'from selected csv.');
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	var rowHeightGroup = mainGroup.add ('group');
		rowHeightGroup.orientation = 'row'
		rowHeightGroup.alignChildren = 'center'
		rowHeightStatic = rowHeightGroup.add ("statictext", undefined, 'Row height: ');
		rowHeightInput = rowHeightGroup.add ("edittext", ([undefined,undefined,50,21]), 4.895);
		rowHeightUnitsStatic = rowHeightGroup.add ("statictext", undefined, 'mm');
	divider2 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
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
	itemRow_height = parseFloat(rowHeightInput.text)*units
	//----------------------------------------------------
	return doSomething,itemRow_height;
}