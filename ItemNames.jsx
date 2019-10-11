//-------------------------------------------------------
/*
	1.Get selection.
	2.Add dedicated layer for names.
	3.For all selected items:
		a.Get XY centre point.
		b.Get name.
		c.Add Name in central position	
*/
//-------------------------------------------------------
userInput()
$.writeln(doSomething + ', ' + removePrefix + ', ' + prefixInput)
if(doSomething === true){
	itemNames()
}else{
	//do nothing
}
//-------------------------------------------------------
function itemNames(){
	if(app.documents.length>0){
		if(app.activeDocument.selection.length > 0){
			//-------------------------------------------------------
			createLayer()
			//-------------------------------------------------------
			for(a=0;a<app.activeDocument.selection.length;a++){
				//-------------------------------------------------------
				/*crosshair(boundsToXY(app.activeDocument.selection[a].geometricBounds)[0],
							boundsToXY(app.activeDocument.selection[a].geometricBounds)[1],
							5,
							app.activeDocument.layers.getByName("Item Names"))*/
				//-------------------------------------------------------
				itemTempName = checkName(app.activeDocument.selection[a]);
				pointTextInfo(itemTempName,
								boundsToXY(app.activeDocument.selection[a].geometricBounds)[0],
								-boundsToXY(app.activeDocument.selection[a].geometricBounds)[1],
								nameSize*(72/25.4),
								app.activeDocument.layers.getByName("Item Names"))
				//-------------------------------------------------------
			}
			//-------------------------------------------------------
		}else{
			$.writeln('Empty Selection')
		}
	}else{
		$.writeln('No Active Document')
	}
}
//-------------------------------------------------------
function checkName(item){
	if(item.typename === 'PlacedItem'){
		//-------------------------------------------------------
		tempString = item.file.displayName;
		if(removeSuffix === true){
			tempString = tempString.split(' ');
			tempString.pop()
			tempString = tempString.join(' ')
		}
		//-------------------------------------------------------
		tempName = tempString
	}else{
		if(item.name === ''){
			tempName = 'Undefined'
		}else{
			tempName = item.name
		}
	}
	//-------------------------------------------------------
	if(removePrefix == true){
		tempName = stringReplacement(tempName,prefixInput,'');
	}
	//-------------------------------------------------------
	return tempName
}
//-------------------------------------------------------
function createLayer(){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name === "Item Names"){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = "Item Names";
			break;
		}
	}
}
//-------------------------------------------------------
function boundsToXY(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			-bounds[1] - ((bounds[3] - bounds[1])/2)
			]
	return xy;
}
//-------------------------------------------------------
function pointTextInfo(text,x,y,s,l){
	vShift = (-10.043952) + (s/2) - (0.046753613 * (s / (72/25.4)))
	s=s*1.350913217
	pointTextFrame = l.textFrames.add();
	pointTextFrame.contents = text;
	pointTextFrame.top = y-vShift 
	pointTextFrame.left = x;
	pointTextFrame.textRange.characterAttributes.size = s;
	pointTextFrame.textRange.characterAttributes.textFont = app.textFonts.getByName('ArialMT');
	pointTextFrame.textRange.characterAttributes.fillColor = blackColour();
	pointTextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	return pointTextFrame;
}
//-------------------------------------------------------
function crosshair(x,y,s,l){ //development only
	//--------------------------------------------------------
	var scale = 1;
	var units = 72/25.4
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
//-------------------------------------------------------
function blackColour(){
	blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK
}
//-------------------------------------------------------
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
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"Item Names");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
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
		suffixCheck = mainGroup.add ("checkbox", undefined, 'Remove size suffix');
		var nameSizeGroup = mainGroup.add ('group');
			nameSizeGroup.orientation = 'row'
			nameSizeGroup.alignChildren = 'center'
			nameSizeStatic = nameSizeGroup.add ("statictext", undefined, 'Name Size: ');
			nameSizeInput = nameSizeGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
			nameSizeUnitsStatic = nameSizeGroup.add ("statictext", undefined, 'mm');
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
	if(suffixCheck.value === true){
		removeSuffix = true
	}else{
		removeSuffix = false
	}
	prefixInput = prefixInputEdit.text
	nameSize = parseFloat(nameSizeInput.text)
	//----------------------------------------------------
	return doSomething,removePrefix,prefixInput,removeSuffix,nameSize;
}