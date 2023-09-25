//----------------------------------------------------
units = 72/25.4

userInput()
if(doSomething === true){
	if(selection.length===1){
		partcodesBoxes()
	}
}else{
	//donothing
}

//----------------------------------------------------
function partcodesBoxes(){
	
	//----------------------------- INIT VARS

	active_lay = app.activeDocument.activeLayer
	active_art = app.activeDocument.artboards[app.activeDocument.artboards.getActiveArtboardIndex()]
	
	xOrigin = selection[0].geometricBounds[0]
	yOrigin = selection[0].geometricBounds[1]
	
	box_width = 15 * units
	box_height = 5 * units
	
	//----------------------------- PREFLIGHT CHECKS
	textframe_length = Boolean(selection.length === 1)
	headerMatch = checkHeader(selection[0].contents);
	if(textframe_length == true && headerMatch == true){
		partcodesArray = partcodeCSVArray(selection[0].contents);
		newBoxesGroup = active_lay.groupItems.add();
		newBoxesGroup.name = 'PartcodesBoxes'
	}else{
		partcodesArray = null
	}
	//----------------------------- MAIN LOOP
	columnsNo = Math.ceil((Math.sqrt(partcodesArray.length)))
	cCol = 0
	cRow = 0
	hOffset = box_width+ (2*units)
	vOffset = box_height+ (2*units)
	chOffset = 0
	cvOffset = 0
	//------------------------------------------------
	for(a=0;a<partcodesArray.length;a++){
		chOffset = hOffset * cCol
		cvOffset = vOffset * cRow
		if(removePrefix == true){
			new_partcode_string = stringReplacement(partcodesArray[a].partcode,prefixInput,'')
		}else{
			new_partcode_string = partcodesArray[a].partcode
		}
		newBox(xOrigin+chOffset,yOrigin-cvOffset,newBoxesGroup,partcodesArray[a].production,new_partcode_string)
		if(cCol==columnsNo){
			cCol=0
			cRow++
		}else{
			cCol++
		}
	}
}
//----------------------------------------------------
function newBox(x,y,l,t,d_text){
	newBoxGroup = l.groupItems.add();
	newBoxGroup.name = d_text
	//----------------------------------------------------
	
	box_width = 15 * units
	box_height = 5 * units
	line_lenght = 15 * units
	text_offset = 0.383 * units
	stroke_width = 0.35 * units
	
	type_die_colour = customColour(0,100,0,0)
	type_kiss_colour = customColour(100,0,0,0)
	type_other_colour = customColour(100,0,100,0)
	white_colour = customColour(0,0,0,0)
	
	//---------------------------------------------------- TYPE BOX

	base_line = newBoxGroup.pathItems.add(x,y,box_width,box_height,false,false);
	base_line.setEntirePath([[x+box_width/2,y-box_height/2],[x+box_width/2,y-box_height/2-line_lenght]]);
	base_line.closed = false;
	base_line.filled = false;
	base_line.stroked = true;
	
	base_line.strokeWidth = stroke_width;
	base_line.strokeDashes = [];
	
	base_box = newBoxGroup.pathItems.add(x,y,box_width,box_height,false,false);
	base_box.setEntirePath([[x,y],[x+box_width,y],[x+box_width,y-box_height],[x,y-box_height]]);
	base_box.closed = true;
	base_box.filled = true;
	base_box.stroked = false;

	switch(t){
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
	
	box_TextFrame = newBoxGroup.textFrames.add();
	box_TextFrame.contents = d_text;
	box_TextFrame.top = y-text_offset
	box_TextFrame.left = x+(box_width/2)
	box_TextFrame.textRange.characterAttributes.size = 12;
	box_TextFrame.textRange.characterAttributes.fillColor = white_colour;
	box_TextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	box_TextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('MyriadPro-Semibold');
	

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
	var w = new Window ('dialog',"PartcodesBoxes");
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
	prefixCheck = prefixGroup.add ("checkbox", undefined, 'Remove prefix');
		var prefixInputGroup = prefixGroup.add ('group');
		prefixInputGroup.orientation = 'row'
		prefixInputGroup.alignChildren = 'center'
		prefixStatic = prefixInputGroup.add ("statictext", undefined, 'Prefix: ');
		prefixInputEdit = prefixInputGroup.add ("edittext", ([undefined,undefined,100,21]), 'AST');
		prefixInputGroup.enabled = false
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
	prefixCheck.onClick = function (){
		if(prefixInputGroup.enabled === true){
			prefixInputGroup.enabled = false;
		}else{
			prefixInputGroup.enabled = true;
		}
	}
	//----------------------------------------------------
	w.show();
	//----------------------------------------------------
	if(prefixCheck.value === true){
		removePrefix = true
	}else{
		removePrefix = false
	}
	//nameSize = parseFloat(nameSizeInput.text)
	//----------------------------------------------------
	prefixInput = prefixInputEdit.text
	return doSomething,removePrefix,prefixInput;//,nameSize;
}