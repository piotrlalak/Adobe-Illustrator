userInput()
if(doSomething === true){
	if(app.activeDocument.selection.length > 0){
		//-------------------------------------------------------
		units = 72 / 25.4
		decimalPoint = precision//5
		activeDoc = app.activeDocument;
		activeLayer = activeDoc.activeLayer;
		weightsList = []
		//------------------------------------------------------- List all different weights
		itemsLength = app.activeDocument.selection.length
		for(p=0;p<itemsLength;p++){
			
			c_item = app.activeDocument.selection[p]
			
			if(c_item.typename == 'TextFrame'){
				weightsList.push('Text')
			
			}else if(c_item.typename == 'CompoundPathItem'){
				
				if(c_item.pathItems[0].stroked == false){
					weightsList.push('None')
				}else{
					c_stroke_w =(c_item.pathItems[0].strokeWidth / units).toFixed(decimalPoint)
					weightsList.push(c_stroke_w)
				}
			
			}else{
				
				if(c_item.stroked == false){
					weightsList.push('None')
				}else{
					c_stroke_w =(c_item.strokeWidth / units).toFixed(decimalPoint)
					weightsList.push(c_stroke_w)
				}
			}
		}
		//$.writeln('\nFull list:\n' +weightsList)
		weightsList = uniq_fast(weightsList)
		//$.writeln('\nReduced list:\n' +weightsList)
		//------------------------------------------------------- Create layers
		for(i=0;i<weightsList.length;i++){
			createLayer(weightsList[i])
		}
		//------------------------------------------------------- Move each item to layer
		itemsLength = app.activeDocument.selection.length
		for(p=0;p<itemsLength;p++){
			c_item = app.activeDocument.selection[p]
			if(c_item.typename == 'TextFrame'){
				c_layer = app.activeDocument.layers.getByName('Text')
				c_layer.locked = false;
				c_layer.visible = true;
				c_item.move(c_layer, ElementPlacement.PLACEATEND);
			}else if(c_item.typename == 'CompoundPathItem'){
				if(c_item.pathItems[0].stroked == false){
					c_layer = app.activeDocument.layers.getByName('None')
					c_layer.locked = false;
					c_layer.visible = true;
					c_item.move(c_layer, ElementPlacement.PLACEATEND);
				}else{
					c_stroke_w =(c_item.pathItems[0].strokeWidth / units).toFixed(decimalPoint)
					c_layer = app.activeDocument.layers.getByName(c_stroke_w)
					c_layer.locked = false;
					c_layer.visible = true;
					c_item.move(c_layer, ElementPlacement.PLACEATEND);
				}
			}else{
				if(c_item.stroked == false){
					c_layer = app.activeDocument.layers.getByName('None')
					c_layer.locked = false;
					c_layer.visible = true;
					c_item.move(c_layer, ElementPlacement.PLACEATEND);
				}else{
					c_stroke_w =(c_item.strokeWidth / units).toFixed(decimalPoint)
					c_layer = app.activeDocument.layers.getByName(c_stroke_w)
					c_layer.locked = false;
					c_layer.visible = true;
					c_item.move(c_layer, ElementPlacement.PLACEATEND);
				}
			}
			p +1
		}

	}
}else{
	//donothing
}
//-------------------------------------------------------
function moveItemToLayer(item,itemName){
	currentLayer = createLayer(itemName)
	item.move(currentLayer, ElementPlacement.PLACEATEND);
}
//-------------------------------------------------------
function uniq_fast(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
//-------------------------------------------------------
function createLayer(layerName){
	isLayer = false
	for(l=0;l<app.activeDocument.layers.length;l++){
		c_layer_name = app.activeDocument.layers[l].name
		if(c_layer_name==layerName){
			isLayer = true
			$.writeln(c_layer_name)
		}
	}
	if(isLayer==true){
		newLayer = app.activeDocument.layers.getByName(layerName)
		newLayer.locked = false;
		newLayer.visible = true;
	}else{
		newLayer = app.activeDocument.layers.add();
		newLayer.name = layerName
	}
	return newLayer
}
//-------------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"StrokeWeightSeparation");
	
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	
	infoGroup = mainGroup.add('group');
		infoGroup.orientation = 'column'
		infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will separate selected items');
		info2 = infoGroup.add ("statictext", undefined,'into new layers by stroke weight');
		info3 = infoGroup.add ("statictext", undefined,'rounded to decimal point below');
	
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	
	var precisionGroup = mainGroup.add ('group');
		precisionGroup.orientation = 'row'
		precisionGroup.alignChildren = 'center'
		precisionStatic = precisionGroup.add ("statictext", undefined, 'Precision: ');
		precisionInput = precisionGroup.add ("edittext", ([undefined,undefined,25,21]), 5);
		
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
	precision = parseFloat(precisionInput.text)
	//----------------------------------------------------
	return doSomething,precision;
}
//-------------------------------------------------------------------------
/*
if(doSomething === true){
	if(app.activeDocument.selection.length > 0){
		//-------------------------------------------------------
		units = 72 / 25.4
		decimalPoint = precision//5
		activeDoc = app.activeDocument;
		activeLayer = activeDoc.activeLayer;
		//-------------------------------------------------------
		itemsLength = app.activeDocument.selection.length
		for(p=0;p<itemsLength;p++){
			c_item = app.activeDocument.selection[p]
			c_stroke_w =(c_item.strokeWidth / units).toFixed(decimalPoint)
			createLayer(c_stroke_w)
			moveItemToLayer(c_item,c_stroke_w)
			p +1
		}
	}
}else{
	//donothing
}
*/