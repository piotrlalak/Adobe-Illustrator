scale = 1/10
units = (72/25.4)*scale;

userInput()

if(doSomething === true){
	for(p=app.activeDocument.selection.length-1;p>=0;p--){
		c_item = app.activeDocument.selection[p]
		iY = c_item.geometricBounds[3]-(c_item.geometricBounds[3]-c_item.geometricBounds[1])
		iX = c_item.geometricBounds[0]
		loc = c_item.parent
		createEskoBarcode(iY+20*units,iX,155*units,20*units,loc,1,addBleed,addCuts)
	}
}else{
	//do nothing
}

//------------------------------------
function createEskoBarcode(x,y,w,h,l,s,b,c){
	
	var eskoBarcodeGroup = l.groupItems.add();
	eskoBarcodeGroup.name = 'Esko Barcode'
	
	if(b==true){
		bleed_background = roundedRect(x+(5*units),y-(5*units),eskoBarcodeGroup,w+(10*units),h+(10*units),10*units)
	}

	white_background = roundedRect(x,y,eskoBarcodeGroup,w,h,5*units)

	s = units / (72/25.4)
	
	partcode_text = pointType('PARTCODE', y+(4.76 * units), x-(8.31 * units) , eskoBarcodeGroup , 14 * s)
	company_text = pointType('COMPANY', y+(4.76 * units),  x-(11.13 * units), eskoBarcodeGroup , 7 * s)
	company_text = pointType('LOCATION', y+(4.76 * units), x-(14.31 * units), eskoBarcodeGroup , 7 * s)
	barcode_text = pointType('*BARCODE*', y+(51.21 * units), x-(15.32 * units), eskoBarcodeGroup , 35.47 * s)
	
	if(c==true){
		cuts_path = roundedRect(x,y,eskoBarcodeGroup,w,h,5*units)
		cuts_path.filled = false
		cuts_path.stroked = true
		cuts_path.strokeColor=createSpotColour('CutContourKissCut',[99,0,0,0])
		cuts_path.strokeWidth = 1 * units
	}

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
//------------------------------------
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
//------------------------------------
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
//------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"EskoBarcodes");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	staticText1 = mainGroup.add ("statictext", undefined, 'Adding esko barcode to each item');
	var checksGroup = mainGroup.add ('group');
	bleedCheck = checksGroup.add ("checkbox", undefined, 'Add bleed');
	cutsCheck = checksGroup.add ("checkbox", undefined, 'Add kiss cuts');
	bleedCheck.value = true
	cutsCheck.value = true
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
	if(bleedCheck.value === true){
		addBleed = true
	}else{
		addBleed = false
	}
	if(cutsCheck.value === true){
		addCuts = true
	}else{
		addCuts = false
	}
	//----------------------------------------------------
	return doSomething,addCuts,addBleed;
}