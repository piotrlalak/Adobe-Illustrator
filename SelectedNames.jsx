userInput()
if(doSomething === true){
	extractSelectedNames()
}else{
	//donothing
}
//--------------------------------------------------------
function extractSelectedNames(){
	fullTextArray = []
	for(a=0;a<app.activeDocument.selection.length;a++){
		currentContent = retreiveText(app.activeDocument.selection[a])
		if(currentContent === '' || currentContent === undefined){
			continue
		}else{
			fullTextArray.push(currentContent)
		}
	}
	if(fullTextArray.length > 0){
		arrayPrint(fullTextArray)
	}
}
//--------------------------------------------------------
function retreiveText(object){
	objectName = object.name
	return objectName
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
		info1 = infoGroup.add ("statictext", undefined,'Script will extract name out of');
		info2 = infoGroup.add ("statictext", undefined,'every item in selection.');
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