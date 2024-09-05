units = 72/25.4
userInput()
if(doSomething === true){
	if(selection.length===1){
		csvToSpot()
	}else{
		alert("No CSV table selected","Empty selection");
	}
}else{
	//donothing
}
//------------------------------------------
function csvToSpot(){
	current_csv_array = csvArray(app.activeDocument.selection[0].contents)

	rectW = itemBox_width //50
	rectH = itemBox_height //50
	rectS = itemBox_space //10
	
	try{
		for(c=0;c<current_csv_array.length;c++){	
			new_colourSquare = colourSquare(
															c*(rectW + rectS),
															0,
															rectW,
															rectH,
															customSpotColour(current_csv_array[c].name,
																					current_csv_array[c].c,
																					current_csv_array[c].m,
																					current_csv_array[c].y,
																					current_csv_array[c].k
																					))
		}
	}
	catch(e){
		alert('Incorrect CSV table structure')
	}
}
//------------------------------------------
function colourSquare(x,y,w,h,c){
	x = x*units
	y = y*units
	w = w*units
	h = h*units
	active_lay = app.activeDocument.activeLayer
	cColourSquare = active_lay.pathItems.add();
	cColourSquare.setEntirePath([[x,y],[x+w,y],[x+w,y-h],[x,y-h]]);
	cColourSquare.closed = true;
	cColourSquare.filled = true;
	cColourSquare.stroked = false;
	cColourSquare.fillColor = c;
}
//------------------------------------------
function csvArray(csv){
	//------------------------------------------
	tempArray = csv.split('\r');
	tempArray = tempArray.toString();
	tempArray = tempArray.split(',')
	spotsArray = null;
	//------------------------------------------
	spotsArray = [];
	//------------------------------------------
	counter = 0;
	//------------------------------------------
	for(f=5;f<tempArray.length-5;f++){
		spotsArray[counter] = {name:tempArray[f], c:tempArray[(f+1)], m:tempArray[(f+2)], y:tempArray[(f+3)], k:tempArray[(f+4)]};
		f+=4
		counter++;
	}
	//------------------------------------------
	return spotsArray;
}
//------------------------------------------
function customSpotColour(n,c,m,y,k){
	try {
		var customSpot = app.activeDocument.spots.getByName(n)
		$.writeln('exists: '+customSpotColor)
		var customSpotColor = new SpotColor();
		customSpotColor.spot = customSpot
		customSpotColor.tint=100
	}
	catch (e) {
		var customCMYK = new CMYKColor();
		customCMYK.cyan = cmykValue(c);
		customCMYK.magenta = cmykValue(m);
		customCMYK.yellow = cmykValue(y);
		customCMYK.black = cmykValue(k);

		var customSpot = app.activeDocument.spots.add()
		customSpot.name=n
		customSpot.colorType = ColorModel.SPOT
		customSpot.color = customCMYK
		
		var customSpotColor = new SpotColor();
		customSpotColor.spot = customSpot
		customSpotColor.tint=100
	}
	return customSpotColor;
}
//------------------------------------------
function customColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
}
//------------------------------------------
function cmykValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>100){
		v=100;
	}
	return v;
}
//------------------------------------------
function boundsToXY(bounds){
	xy = [bounds[0] + ((bounds[2] - bounds[0])/2),
			-bounds[1] - ((bounds[3] - bounds[1])/2)
			]
	return xy;
}
//------------------------------------------
function userInput(){
	var w = new Window ('dialog',"CSVtoSpot");
	
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create spot colour boxes from selected CSV.');
		info2 = infoGroup.add ("statictext", undefined,'CSV cols to follow: Name, C, M, Y, K.');
	
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	
	var varsGroup = mainGroup.add ('group');
	
	var spotWidthGroup = varsGroup.add ('group');
		spotWidthGroup.orientation = 'column'
		spotWidthGroup.alignChildren = 'center'
		spotWidthStatic = spotWidthGroup.add ("statictext", undefined, 'Spot width: ');
		spotWidthInput = spotWidthGroup.add ("edittext", ([undefined,undefined,50,21]), 50);
		spotWidthUnitsStatic = spotWidthGroup.add ("statictext", undefined, 'mm');
		
	var spotHeightGroup = varsGroup.add ('group');
		spotHeightGroup.orientation = 'column'
		spotHeightGroup.alignChildren = 'center'
		spotHeightStatic = spotHeightGroup.add ("statictext", undefined, 'Spot height: ');
		spotHeightInput = spotHeightGroup.add ("edittext", ([undefined,undefined,50,21]), 50);
		spotHeightUnitsStatic = spotHeightGroup.add ("statictext", undefined, 'mm');
		
	var spotSpacingGroup = varsGroup.add ('group');
		spotSpacingGroup.orientation = 'column'
		spotSpacingGroup.alignChildren = 'center'
		spotSpacingStatic = spotSpacingGroup.add ("statictext", undefined, 'Spacing: ');
		spotSpacingInput = spotSpacingGroup.add ("edittext", ([undefined,undefined,50,21]), 10);
		spotSpacingUnitsStatic = spotSpacingGroup.add ("statictext", undefined, 'mm');		
		
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
	itemBox_width = parseFloat(spotWidthInput.text)
	itemBox_height = parseFloat(spotHeightInput.text)
	itemBox_space = parseFloat(spotSpacingInput.text)
	//----------------------------------------------------
	return doSomething,itemBox_width,itemBox_height,itemBox_space;
}