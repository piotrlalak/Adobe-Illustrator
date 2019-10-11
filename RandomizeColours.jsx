userInput()
randomizeColours()
//----------------------------------------------------
function randomizeColours(){
	if(doSomething === true){
		for(a=0;a<app.activeDocument.selection.length;a++){
			applyRandomColour(app.activeDocument.selection[a])
		}
	}
}
//----------------------------------------------------
function applyRandomColour(item){
	currentRandomColour = randomColour()
	switch(item.typename){
		case 'PathItem':
			if(item.filled === true){
				item.fillColor = currentRandomColour
			}
			if(item.stroked === true){
				item.strokeColor = currentRandomColour
			}
			break;
		case 'CompoundPathItem':
			if(item.pathItems[0].filled === true){
				item.pathItems[0].fillColor = currentRandomColour
			}
			if(item.pathItems[0].stroked === true){
				item.pathItems[0].strokeColor = currentRandomColour
			}
			break;
		case 'GroupItem':
			for(var i=0;i<item.pageItems.length;i++){
				applyRandomColour(item.pageItems[i])
			}
			break;
		default:
			//item.fillColor = randomColour()
			break;
	}
}
//----------------------------------------------------
function randomColour(){
	newColour = customRGBColour(getRandomInt(0, 255),getRandomInt(0, 255),getRandomInt(0, 255))
	return newColour
}
//----------------------------------------------------
function customRGBColour(r,g,b){
	var customRGB = new RGBColor();
	customRGB.red = rgbValue(r);
	customRGB.green = rgbValue(g);
	customRGB.blue = rgbValue(b);
	return customRGB;
}
//----------------------------------------------------
function customCMYKColour(c,m,y,k){
	var customCMYK = new CMYKColor();
	customCMYK.cyan = cmykValue(c);
	customCMYK.magenta = cmykValue(m);
	customCMYK.yellow = cmykValue(y);
	customCMYK.black = cmykValue(k);
	return customCMYK;
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
function rgbValue(v){
	if (v < 0){
		v = 0;
	}
	if (v>255){
		v=255;
	}
	return v;
}
//----------------------------------------------------
function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"RandomizeColours");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will apply random colour');
		info2 = infoGroup.add ("statictext", undefined,'to every editable item in selection');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	return doSomething;
}