////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(app.documents.length > 0 ){
	var doc = app.activeDocument;
	var units = 72/25.4; //1mm is units * 1
	getMeasurements()
	averageSizeMessage()
}else{
	$.writeln('No active document')
	//do nothing
}
//alert(finalMessage,'Average Size')
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getMeasurements(){
	var totalWidth = 0;
	var totalHeight = 0;
	var totalSquareM = 0;
	totalLength = 0;
	//-------------------------------------------------------------------------------------------------------------------
	var sizesArray = new Array ();
	//-------------------------------------------------------------------------------------------------------------------
	var docLayers = doc.layers.length;
	for(i=0; i<docLayers;i++){
		var docLayer = doc.layers[i];
		if (docLayer.hasSelectedArtwork == true){
			var graphicsLayer = doc.layers[i];
			break;
		}else{
			var graphicsLayer = doc.layers[0];
			}
	}
	//-------------------------------------------------------------------------------------------------------------------
	if (graphicsLayer.hasSelectedArtwork === true){    
		var docSelected = app.activeDocument.selection;//if looking for top object in selection use "selection[0]"
		}else{
		var docSelected = graphicsLayer.pageItems;//top object in the layer
	}

	for(a=0;a<docSelected.length; a++){
		//sizesArray[a] = {w:docSelected[a].width, h:docSelected[a].height, z:docSelected[a].zOrderPosition};
		totalWidth += docSelected[a].width;
		totalHeight += docSelected[a].height;
		totalSquareM += (docSelected[a].width/units)*(docSelected[a].height/units)/1000;
		if(docSelected[a].typename === "TextFrame"){
			docSelected[a].createOutline();
			$.writeln('text outlined')
		}
		measureSelected(docSelected[a])
		if(docSelected[a].typename === "GroupItem"){
				for(c=0;c<docSelected[a].pageItems.length;c++){
					measureSelected(docSelected[a].pageItems[c])
				}
		}
	}
	//-------------------------------------------------------------------------------------------------------------------
	panelNumbers = (docSelected.length).toString();
	averageWidth = ((totalWidth/units)/docSelected.length);
	averageHeight = ((totalHeight/units)/docSelected.length);
	squareMetersPanelStr = ((totalSquareM/1000)/docSelected.length);
	squareMetersStr = (totalSquareM/1000);
	totalLengthStr = (totalLength/units);
	//-------------------------------------------------------------------------------------------------------------------
	finalMessage = "Average size of " + panelNumbers + " panel(s):\n"
							+ averageWidth + "mm (w) x " + averageHeight + "mm (h)"
							+ "\n"
							+ "\nAverage Square Meter per 1 panel:\n"
							+ squareMetersPanelStr + " m^2"
							+ "\n"
							+ "\nTotal Square Meters:\n"
							+ squareMetersStr + " m^2\n"
							+ "\n"
							+ "\nTotal Path Length:\n"
							+ totalLengthStr + " mm";
	return totalLength,panelNumbers,averageWidth,averageHeight,squareMetersPanelStr,squareMetersStr,totalLengthStr,finalMessage;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function averageSizeMessage(){
	decimalPoint = 5
	var inputMessage = finalMessage;
	var mainPaletteWindow = new Window ("dialog")
	mainPaletteWindow.alignChildren = "left"
	//-------------------------------------------------------------------------------------------------------------------
	var averagePanelGroup = mainPaletteWindow.add("panel",undefined, "Average size of " + panelNumbers + " panel(s):" , {borderStyle:"white"});
	averagePanelGroup.orientation = "column"
	averagePanelGroup.alignChildren = "left"
	var inputTextDisplay1 = averagePanelGroup.add ("statictext", undefined , averageWidth.toFixed(decimalPoint) + "mm (w) x " + averageHeight.toFixed(decimalPoint) + "mm (h)");
	//-------------------------------------------------------------------------------------------------------------------
	var averageSquareGroup = mainPaletteWindow.add("panel",undefined, "Average Square Meter per 1 panel:" , {borderStyle:"white"});
	averageSquareGroup.orientation = "column"
	averageSquareGroup.alignChildren = "left"
	var inputTextDisplay2 = averageSquareGroup.add ("statictext", undefined ,squareMetersPanelStr.toFixed(decimalPoint) + " m^2");
	//-------------------------------------------------------------------------------------------------------------------
	var totalSquareGroup = mainPaletteWindow.add("panel",undefined, "Total Square Meters:" , {borderStyle:"white"});
	totalSquareGroup.orientation = "column"
	totalSquareGroup.alignChildren = "left"
	var inputTextDisplay3 = totalSquareGroup.add ("statictext", undefined ,squareMetersStr.toFixed(decimalPoint) + " m^2");
	//-------------------------------------------------------------------------------------------------------------------
	var totalLengthGroup = mainPaletteWindow.add("panel",undefined, "Total Path Length:" , {borderStyle:"white"});
	totalLengthGroup.orientation = "column"
	totalLengthGroup.alignChildren = "left"
	var inputTextDisplay4 = totalLengthGroup.add ("statictext", undefined ,totalLengthStr.toFixed(decimalPoint) + " mm");
	//-------------------------------------------------------------------------------------------------------------------
	var approxNestGroup = mainPaletteWindow.add("panel",undefined, "Approximate Nest Length:" , {borderStyle:"white"});
	approxNestGroup.orientation = "column"
	approxNestGroup.alignChildren = "left"
	var inputTextDisplay5 = approxNestGroup.add ("statictext", undefined , "1.22 x " + ((squareMetersStr*1000)/1180).toFixed(decimalPoint) + " m");
	var inputTextDisplay6 = approxNestGroup.add ("statictext", undefined , "1.37 x " + ((squareMetersStr*1000)/1300).toFixed(decimalPoint) + " m");
	var inputTextDisplay7 = approxNestGroup.add ("statictext", undefined , "1.52 x " + ((squareMetersStr*1000)/1450).toFixed(decimalPoint) + " m");
	//-------------------------------------------------------------------------------------------------------------------
	var decimalGroup = mainPaletteWindow.add('panel',undefined, "Decimal Point" , {borderStyle:'white'});
	decimalGroup.orientation = 'row'
	var decimalButtonMinus = decimalGroup.add ("button", undefined, "-");
	var decimalButtonPlus = decimalGroup.add ("button", undefined, "+");
	decimalButtonMinus.onClick = function(){
		if(decimalPoint>0){
			decimalPoint--;
		};
		inputTextDisplay1.text = averageWidth.toFixed(decimalPoint) + "mm (w) x " + averageHeight.toFixed(decimalPoint) + "mm (h)";
		inputTextDisplay2.text = squareMetersPanelStr.toFixed(decimalPoint) + " m^2";
		inputTextDisplay3.text = squareMetersStr.toFixed(decimalPoint) + " m^2";
		inputTextDisplay4.text = totalLengthStr.toFixed(decimalPoint) + " mm";
		inputTextDisplay5.text = "1.22 x " + ((squareMetersStr*1000)/1180).toFixed(decimalPoint) + " m";
		inputTextDisplay6.text = "1.37 x " + ((squareMetersStr*1000)/1300).toFixed(decimalPoint) + " m";
		inputTextDisplay7.text = "1.52 x " + ((squareMetersStr*1000)/1450).toFixed(decimalPoint) + " m";
	};  
	decimalButtonPlus.onClick = function(){
		if(decimalPoint<5){
			decimalPoint++;
		};
		inputTextDisplay1.text = averageWidth.toFixed(decimalPoint) + "mm (w) x " + averageHeight.toFixed(decimalPoint) + "mm (h)";
		inputTextDisplay2.text = squareMetersPanelStr.toFixed(decimalPoint) + " m^2";
		inputTextDisplay3.text = squareMetersStr.toFixed(decimalPoint) + " m^2";
		inputTextDisplay4.text = totalLengthStr.toFixed(decimalPoint) + " mm";
		inputTextDisplay5.text = "1.22 x " + ((squareMetersStr*1000)/1180).toFixed(decimalPoint) + " m";
		inputTextDisplay6.text = "1.37 x " + ((squareMetersStr*1000)/1300).toFixed(decimalPoint) + " m";
		inputTextDisplay7.text = "1.52 x " + ((squareMetersStr*1000)/1450).toFixed(decimalPoint) + " m";
	};
	//-------------------------------------------------------------------------------------------------------------------
	var bottomGroup = mainPaletteWindow.add('panel',undefined, undefined , {borderStyle:'white'});
	bottomGroup.orientation = 'row'
	//var updateButton = bottomGroup.add ("button", undefined, "Update");
	var closeButton = bottomGroup.add ("button", undefined, "Close");
	closeButton.onClick = function(){mainPaletteWindow.close();}
	//-------------------------------------------------------------------------------------------------------------------
	mainPaletteWindow.show();
}
function measureSelected(element){
	if(element.typename === "PathItem"){
		totalLength += element.length;
	}else if (element.typename === "CompoundPathItem"){
		for(b = 0; b<element.pathItems.length;b++){
			totalLength += element.pathItems[b].length;
		}
	}
}
//-------------------------------------------------------------------------------------------------------------------
//app.undo();