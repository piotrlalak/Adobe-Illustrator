userInput()
if(doSomething === true){
	extractSelectedText()
}else{
	//donothing
}
//--------------------------------------------------------
function extractSelectedText(){
	fullTextArray = []
	for(a=0;a<app.activeDocument.selection.length;a++){
		currentContent = retreiveText(app.activeDocument.selection[a])
		//$.writeln(currentContent)
		if(currentContent === '' || currentContent === undefined){
			continue
		}else{
			fullTextArray.push()
		}
	}
	if(fullTextArray.length > 0){
		arrayPrint(fullTextArray)
	}
}
//--------------------------------------------------------
function retreiveText(object){
	switch(object.typename){
		case 'TextFrame':
			currentText = object.contents
			//$.writeln(currentText)
			fullTextArray.push(currentText)
			break;
		case 'GroupItem':
			for(var g=0;g<object.pageItems.length;g++){
				retreiveText(object.pageItems[g]);
			}
			break;
		default:
			break;
	}
}
//--------------------------------------------------------
function arrayPrint(array){
	activeArtboardIndex = app.activeDocument.artboards.getActiveArtboardIndex();
	artRect = app.activeDocument.artboards[activeArtboardIndex].artboardRect
	areaPath = app.activeDocument.activeLayer.pathItems.rectangle(artRect[1],artRect[0],(artRect[2] - artRect[0]),-(artRect[3] - artRect[1]));
	areaTextFrame = app.activeDocument.activeLayer.textFrames.areaText(areaPath);
	areaTextFrame.contents = array.join();
	return areaTextFrame;
}
//--------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"ExtractSelectedText");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will extract text out of');
		info2 = infoGroup.add ("statictext", undefined,'every textframe in selection.');
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