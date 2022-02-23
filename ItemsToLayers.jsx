//-----------------------------------------------------------------------------------------------------------------------------------
userInput()
if(doSomething === true){
	itemsToLayers()
}else{
	//donothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function itemsToLayers(){
	if(app.documents.length>0){
		currentSelection = app.activeDocument.selection
		selectionLength = currentSelection.length
		if(selectionLength > 0){
			//for(a=0;a<selectionLength;a++){ //forward loop
			for(a=selectionLength-1;a>=0;a--){ //backward loop
				moveItemToLayer(currentSelection[a])
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
function moveItemToLayer(item){
	currentLayer = createLayer(item.name)
	item.move(currentLayer, ElementPlacement.PLACEATEND);
}
//-------------------------------------------------------
function createLayer(layerName){
	for(l=0;l<app.activeDocument.layers.length;l++){
		if (app.activeDocument.layers[l].name == layerName){
			app.activeDocument.layers[l].locked = false;
			break
		}else{
			itemNamesLayer = app.activeDocument.layers.add();
			itemNamesLayer.name = layerName;
			break;
		}
	}
	return app.activeDocument.layers.getByName(layerName)
}
//-----------------------------------------------------------------------------------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"ItemsToLayers");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will move selected items');
		info2 = infoGroup.add ("statictext", undefined,'into new layers of their own name');
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
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
	return doSomething
}