//-----------------------------------------------------------------------------------------------------------------------------------
userInput()
if(doSomething === true){
	colourValues()
}else{
	//donothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function colourValues(){
	if(app.documents.length>0){
		if(app.activeDocument.selection.length > 0){
			//-------------------------------------------------------
			createLayer()
			//-------------------------------------------------------
			for(a=0;a<app.activeDocument.selection.length;a++){
				itemTempName = checkName(app.activeDocument.selection[a]);
				pointTextInfo(itemTempName,
								boundsToXY(app.activeDocument.selection[a].geometricBounds)[0],
								-boundsToXY(app.activeDocument.selection[a].geometricBounds)[1],
								nameSize*(72/25.4),
								app.activeDocument.layers.getByName("Colour Values"))
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
function checkName(item){
	if(item.typename === 'PathItem'){
		if(app.activeDocument.documentColorSpace === DocumentColorSpace.CMYK){
			decimalPoint = 2
			itemColour = item.fillColor
			if(itemColour.typename == 'CMYKColor'){
				itemColour = [(itemColour.cyan).toFixed(decimalPoint),
								(itemColour.magenta).toFixed(decimalPoint),
								(itemColour.yellow).toFixed(decimalPoint),
								(itemColour.black).toFixed(decimalPoint)]
				tempName = 'C:' + itemColour[0] + '% '
				tempName += 'M:' + itemColour[1] + '% '
				tempName += 'Y:' + itemColour[2] + '% '
				tempName += 'K:' + itemColour[3] + '%'
			}else if(itemColour.typename == 'SpotColor'){
				tempName = itemColour.spot.name
			}
		}else{
			decimalPoint = 0
			itemColour = item.fillColor
			itemColour = [(itemColour.red).toFixed(decimalPoint),
							(itemColour.green).toFixed(decimalPoint),
							(itemColour.blue).toFixed(decimalPoint)]
			tempName = 'R:' + itemColour[0]
			tempName += ' G:' + itemColour[1]
			tempName += ' B:' + itemColour[2]
		}
		
	}
	return tempName
}
//-------------------------------------------------------		
function createLayer(){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name === "Colour Values"){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = "Colour Values";
			break;
		}
	}
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
//-----------------------------------------------------------------------------------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"ColourValues");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create text object');
		info2 = infoGroup.add ("statictext", undefined,'with CMYK colour values');
		info3 = infoGroup.add ("statictext", undefined,'for every item in selection.');
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	var nameSizeGroup = mainGroup.add ('group');
		nameSizeGroup.orientation = 'row'
		nameSizeGroup.alignChildren = 'center'
		nameSizeStatic = nameSizeGroup.add ("statictext", undefined, 'Text Size: ');
		nameSizeInput = nameSizeGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
		nameSizeUnitsStatic = nameSizeGroup.add ("statictext", undefined, 'mm');
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
	nameSize = parseFloat(nameSizeInput.text)
	//----------------------------------------------------
	return doSomething,nameSize;
}