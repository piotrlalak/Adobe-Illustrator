//-----------------------------------------------------------------------------------------------------------------------------------
userInput()
if(doSomething === true){
	fillStrokeSwap()
}else{
	//donothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function fillStrokeSwap(){
	if(app.documents.length>0){
		currentSelection = app.activeDocument.selection
		selectionLength = currentSelection.length
		if(selectionLength > 0){
			//for(a=0;a<selectionLength;a++){ //forward loop
			for(a=selectionLength-1;a>=0;a--){ //backward loop
				swapItem(currentSelection[a])
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
function swapItem(item){
	switch(item.typename){
		case 'PathItem':
			f_c = item.fillColor
			s_c = item.strokeColor
			$.writeln('Path: '+ f_c + ' | ' + s_c)
			if(!item.stroked){
				item.stroked = true
				item.strokeColor = f_c
				item.filled = false
			}else{
				item.filled = true
				item.fillColor = s_c
				item.stroked = false
			}
			break;
			$.writeln('New Path: '+ f_c + ' | ' + s_c)
		case 'CompoundPathItem':
			item = item.pathItems[0]
			f_c = item.fillColor
			s_c = item.strokeColor
			$.writeln('Compound: '+ f_c + ' | ' + s_c)
			if(!item.stroked){
				item.stroked = true
				item.strokeColor = f_c
				item.filled = false
			}else{
				item.filled = true
				item.fillColor = s_c
				item.stroked = false
			}
			$.writeln('New Compound: '+ f_c + ' | ' + s_c)
			break;
		default:
			break
	}
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
	var w = new Window ('dialog',"FillStrokeSwap");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will flip strokes and fills');
		info2 = infoGroup.add ("statictext", undefined,'on selected path items.');
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