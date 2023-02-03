//-------------------
$.writeln('\n-------------- ArtboardToRect.jsx --------------\nCreating rects to artboards...\n');
userInput();
artboardToRect();
//-------------------
function artboardToRect(){
	if(doSomething === true){
		createLayer()
		for(c=0;c<app.activeDocument.artboards.length;c++){
			c_art = app.activeDocument.artboards[c]
			c_rect = c_art.artboardRect
			if(c_art.name.length > 0){
				c_name = c_art.name
			}else{
				c_name = 'Artboard ' + (c+1)
			}
			$.writeln(c_name,c_rect)
			artboardRect(app.activeDocument.layers.getByName("Artboards"),c_rect,c_name)
		}
	}
}
$.writeln('-----------------------------------------------------------------------');
//----------------------------------------------------
function createLayer(){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name === "Artboards"){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = "Artboards";
			break;
		}
	}
}
//----------------------------------------------------
function artboardRect(loc,artRect,artName){
	board =  loc.pathItems.rectangle(artRect[1],artRect[0],neg2pos((artRect[0] - artRect[2])),neg2pos((artRect[1] - artRect[3])),false);	
	board.closed = true;
	board.stroked = false;
	board.filled - true;
	board.fillColor = blackColour()
	board.name = artName
	return board;
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
//----------------------------------------------------
function blackColour(){
	blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"ArtboardToRect");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create rectangles on each artboard');
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