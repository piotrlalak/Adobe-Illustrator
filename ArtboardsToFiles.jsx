/*
	For each artboard:
		1.Select all artwork thats sits within artboard boundaries even if it falls out  WORKS
			a.compare if artwork even remotely sits on artboard if so, select. WORKS
		2.Create new document - WORKS
		4.Duplicate selected artwork to new document - WORKS without layers, needs hierarchy
		5.Save as AI or PDF to selected folder.
*/
//-------------------------------------------------------- 
initialConstants();
userInput();
if(doSomething === true){
	artboardToFiles()
}else{
	//do nothing
}
//--------------------------------------------------------
function newDocument(layersArray,artboardName,artRect){
	//--------------------------------------------------------
	tempWidth = neg2pos(artRect[0]-artRect[2])
	tempHeight = neg2pos(artRect[1]-artRect[3])
	//--------------------------------------------------------
	docPresets = new DocumentPreset();
	docPresets.artboardLayout = DocumentArtboardLayout.Column;
	docPresets.artboardRowsOrCols = 1;
	docPresets.artboardSpacing = 0;
	docPresets.colorMode = DocumentColorSpace.CMYK;
	docPresets.height = tempHeight;
	docPresets.numArtboards = 1
	docPresets.rasterResolution = DocumentRasterResolution.HighResolution;
	docPresets.title = artboardName;
	docPresets.units = RulerUnits.Millimeters;
	docPresets.width = tempWidth;
	//--------------------------------------------------------
	newDoc = app.documents.addDocument('temp',docPresets,false)
	//--------------------------------------------------------
	newDoc.layers[0].name = layersArray[0].name;
	for(l=1;l<layersArray.length;l++){
		newLayer = newDoc.layers.add();
		newLayer.name = layersArray[l].name
	}
	//--------------------------------------------------------
	newDoc.artboards[0].name = artboardName;
	//--------------------------------------------------------
	return newDoc;
}
//-------------------------------------------------------- 
function artboardToFiles(){
	//--------------------------------------------------------
	for(c=0;c<app.activeDocument.artboards.length;c++){
		//-------------------------------------------------------- 
		app.activeDocument.selection = null;
		//-------------------------------------------------------- 
		currentArtboard = app.activeDocument.artboards[c];
		currentArtboardName = currentArtboard.name;
		currentArtboardRect = currentArtboard.artboardRect;
		//-------------------------------------------------------- 
		tempArtboardRect(currentArtboardRect);
		selectArtworkOnArtboard(currentArtboard);
		selectedLayers(app.activeDocument.selection);
		//-------------------------------------------------------- 
		currentDocument = app.activeDocument;
		currentNewDoc = newDocument(currentSelectionLayerArray,currentArtboardName,currentArtboardRect);
		//-------------------------------------------------------- 
		currentDocument.activate();
		duplicateSelected(app.activeDocument.selection,currentNewDoc);
		//--------------------------------------------------------
		newDoc.activate();
		newDocArtboardRectLayer = app.activeDocument.layers.getByName('TempArtboardRectLayer');
		newDocArtboardRectItem = tempArtboardRectLayer.pageItems.getByName('TempArtboardRect');
		app.activeDocument.artboards[0].artboardRect = newDocArtboardRectItem.geometricBounds;
		newDocArtboardRectLayer.remove();
		//--------------------------------------------------------
		if(filetypeInput === 'AI'){
			saveAI(outputFilename(app.activeDocument.artboards[0]));
		}else if(filetypeInput === 'PDF'){
			savePDF(outputFilename(app.activeDocument.artboards[0]));
		}else{
			saveDWG(outputFilename(app.activeDocument.artboards[0]));
		}
		//--------------------------------------------------------
		currentDocument.activate();
		//--------------------------------------------------------
		tempArtboardRectLayer.remove();
		//-------------------------------------------------------- 
	}
	app.activeDocument.selection = null;
}
//-------------------------------------------------------- 
function selectArtworkOnArtboard(artboard){
	for(var a=0;a<app.activeDocument.layers.length;a++){
		if(app.activeDocument.layers[a].locked === true){
			continue;
		}else{
			for(var b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
				currentItem = app.activeDocument.layers[a].pageItems[b];
				isInsideArtboard(visibleObjectBounds(currentItem),artboard.artboardRect);
				if(isInside === true){
					currentItem.selected = true;
				}
			}
		}
	}
}
//-------------------------------------------------------- 
function visibleObjectBounds(item){
	var itemBounds = [];
	switch(item.typename){
		case 'PathItem':
			itemBounds = item.geometricBounds;
			break;
		case 'CompoundPathItem':
			itemBounds = item.geometricBounds;
			break;
		case 'GroupItem':
			if(item.clipped === true){
				itemBounds = item.pageItems[0].geometricBounds;
			}else{
				itemBounds = item.pageItems[0].geometricBounds;
				for(var g=1;g<item.pageItems.length;g++){
					if(item.pageItems[g].typename !== 'GroupItem'){
						itemBounds = replaceBiggerBounds(item.pageItems[g].geometricBounds,itemBounds);
					}else{
						subBounds = visibleObjectBounds(item.pageItems[g]);
						itemBounds = replaceBiggerBounds(subBounds,itemBounds);
					}
				}
			}
			break;
		default:
			itemBounds = item.geometricBounds;
			break;
	}
	return itemBounds;
}
//--------------------------------------------------------
function replaceBiggerBounds(newBounds,oldBounds){//replaces bounds if they are bigger
	//--------------------------------------------------------
	if(newBounds[0] < oldBounds[0]){
		oldBounds[0] = newBounds[0];
	}
	//--------------------------------------------------------
	if(newBounds[1] > oldBounds[1]){
		oldBounds[1] = newBounds[1];
	}
	//--------------------------------------------------------
	if(newBounds[2] > oldBounds[2]){
		oldBounds[2] = newBounds[2];
	}
	//--------------------------------------------------------
	if(newBounds[3] < oldBounds[3]){
		oldBounds[3] = newBounds[3];
	}
	return oldBounds;
}
//--------------------------------------------------------
function duplicateSelected(selection,document){
	//--------------------------------------------------------
	for(s = 0;s<selection.length;s++){
		currentItem = selection[s];
		currentItemLayer = currentItem.layer.name;
		newDocLayer = document.layers.getByName(currentItemLayer)
		currentItem.duplicate(newDocLayer, ElementPlacement.PLACEATEND);
	}
}
//--------------------------------------------------------
function isInsideArtboard(itemBounds,artboardBounds){
	//--------------------------------------------------------
	isInside = false;
	//--------------------------------------------------------
	if(itemBounds[2] >= artboardBounds[0]
		&& itemBounds[3] <= artboardBounds[1]
		&& itemBounds[0] <= artboardBounds[2]
		&& itemBounds[1] >= artboardBounds[3]){
		isInside = true;
	}
	//--------------------------------------------------------
	return isInside;
}
//--------------------------------------------------------
function roundBounds(bounds,decimalPoint){
	newBounds = new Array(4);
	newBounds[0] = parseFloat(bounds[0].toFixed(decimalPoint))
	newBounds[1] = parseFloat(bounds[1].toFixed(decimalPoint))
	newBounds[2] = parseFloat(bounds[2].toFixed(decimalPoint))
	newBounds[3] = parseFloat(bounds[3].toFixed(decimalPoint))
	return newBounds;
}
//--------------------------------------------------------
function neg2pos(value){
	if(value < 0){
		newValue = value / -1
	}else{
		newValue = value;
	}
	return newValue;
}
//--------------------------------------------------------
function tempArtboardRect(artRect){
	//--------------------------------------------------------
	tempArtboardRectLayer = app.activeDocument.layers.add();
	tempArtboardRectLayer.name = 'TempArtboardRectLayer';
	//--------------------------------------------------------
	tempArtboard = tempArtboardRectLayer.pathItems.rectangle(artRect[1],
																artRect[0],
																neg2pos((currentArtboard.artboardRect[0] - currentArtboard.artboardRect[2])),
																neg2pos((currentArtboard.artboardRect[1] - currentArtboard.artboardRect[3])),
																false);
	tempArtboard.name = 'TempArtboardRect'
	tempArtboard.filled = false;
	tempArtboard.stroked = false;
	//--------------------------------------------------------
	return tempArtboardRectLayer,tempArtboard;
}
//--------------------------------------------------------
function selectedLayers(selection){
	//--------------------------------------------------------
	currentSelectionLayerArray = [];
	//--------------------------------------------------------
	layerCounter = 1;
	currentLayer = selection[0].layer;
	currentSelectionLayerArray[0] = currentLayer;
	//--------------------------------------------------------
	for(a=0;a<selection.length;a++){
		//--------------------------------------------------------
		currentItem = selection[a];
		//--------------------------------------------------------
		if(currentLayer != selection[a].layer){
			currentSelectionLayerArray[layerCounter] = selection[a].layer;
			currentLayer = selection[a].layer;
			layerCounter++
		}
		//--------------------------------------------------------
	}
	//--------------------------------------------------------
	currentSelectionLayerArray.reverse();
	//--------------------------------------------------------
	return currentSelectionLayerArray;
}
//----------------------------------------------------
function saveAI(filename){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------
	saveOptions = new PDFSaveOptions();
	saveOptions.artboardRange = '1';
	saveOptions.compatibility = PDFCompatibility.ACROBAT5;
	saveOptions.generateThumbnails = true;
	saveOptions.preserveEditability = true;
	saveOptions.compressArt = true;
	//----------------------------------------------------	
	flatOptions = new PrintFlattenerOptions();
	flatOptions.clipComplexRegions = true;
	saveOptions.flattenerOptions = flatOptions;
	//----------------------------------------------------
	fileSpec = new File(filename);
	app.activeDocument.saveAs(fileSpec);
	//----------------------------------------------------
	closeOptions = SaveOptions.DONOTSAVECHANGES;
	document.close(closeOptions);
	//----------------------------------------------------
}
//----------------------------------------------------
function savePDF(filename){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------
	saveOptions = new PDFSaveOptions();
	saveOptions.artboardRange = '1';
	saveOptions.compatibility = PDFCompatibility.ACROBAT5;
	saveOptions.generateThumbnails = true;
	saveOptions.preserveEditability = true;
	saveOptions.compressArt = true;
	//----------------------------------------------------	
	flatOptions = new PrintFlattenerOptions();
	flatOptions.clipComplexRegions = true;
	saveOptions.flattenerOptions = flatOptions;
	//----------------------------------------------------
	fileSpec = new File(filename);
	app.activeDocument.saveAs(fileSpec,saveOptions);
	//----------------------------------------------------
	closeOptions = SaveOptions.DONOTSAVECHANGES;
	document.close(closeOptions);
	//----------------------------------------------------
}
//----------------------------------------------------
function saveDWG(filename){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------
	saveOptions = new ExportOptionsAutoCAD();
	saveOptions.alterPathsForAppearance = false
	saveOptions.convertTextToOutlines = true
	saveOptions.exportFileFormat = AutoCADExportFileFormat.DWG
	saveOptions.unit = AutoCADUnit.Millimeters
	saveOptions.unitScaleRatio = 1; //
	//----------------------------------------------------
	fileSpec = new File(filename);
	app.activeDocument.exportFile(fileSpec, ExportType.AUTOCAD,saveOptions);
	//----------------------------------------------------
	closeOptions = SaveOptions.DONOTSAVECHANGES;
	document.close(closeOptions);
	//----------------------------------------------------
}
//----------------------------------------------------
function checkURL(){
	if(app.documents.length == 0 ){
		alert('No documents open','Artboards To Files - Error');
	}else{
		if(app.activeDocument.path != 0){
			activeURL = app.activeDocument.path;
			folderPath = activeURL
		}else{
			activeURL = 'Select folder';
			folderPath = '~'
		}
	}
	return activeURL,folderPath;
}
//----------------------------------------------------
function initialConstants(){
	filenameCounterValue = 1;
	tolerance = 1;
	units = 72 / 25.4; //points to mm
	doSomething = false;
	checkURL();
}
//----------------------------------------------------
function userInput(){
	var w = new Window ('dialog',"Artboards To Files");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	var fileGroup = mainGroup.add ('group');
	fileGroup.orientation = 'row'
		//----------------------------------------------------
		var filetypePanel = fileGroup.add('panel',undefined , 'Filetype', {borderStyle:'white'});
		filetypePanel.orientation = 'column'
		filetypePanel.alignChildren = 'left'
		var aiRadio = filetypePanel.add ("radiobutton", undefined, 'AI');
		aiRadio.value = true;
		var pdfRadio = filetypePanel.add ("radiobutton", undefined, 'PDF');
		var dwgRadio = filetypePanel.add ("radiobutton", undefined, 'DWG');
		//----------------------------------------------------
		var filenamePanel = fileGroup.add('panel',undefined , 'Filename', {borderStyle:'white'});
		filenamePanel.alignChildren = 'LEFT'
			var filenameGroup = filenamePanel.add ('group');
			filenameGroup.orientation = 'column'
			filenameGroup.alignChildren = 'left'
			//----------------------------------------------------
			var filenameArtboardRadio = filenameGroup.add ("radiobutton", undefined, 'Artboard Name');
			filenameArtboardRadio.value = true
			var filenameTextRadio = filenameGroup.add ("radiobutton", undefined, 'Uniform Name');
				var filenameSubGroup = filenameGroup.add ('group');
				filenameSubGroup.orientation = 'column'
				filenameSubGroup.alignChildren = 'left'
				var counterCheck = filenameSubGroup.add ("checkbox", undefined, '+ Counter');
				var filenameText = filenameSubGroup.add ("edittext", ([undefined,undefined,220,21]), app.activeDocument.name.split('.')[0]);
				counterCheck.enabled = false;
				filenameText.enabled = false;
			//----------------------------------------------------
			var filenameGroup2 = filenamePanel.add ('group');
			filenameGroup2.orientation = 'row'
			filenameGroup2.alignChildren = 'center'
			//----------------------------------------------------
			var filenameSizeCheck = filenameGroup2.add ("checkbox", undefined, '+ Item size');
			var filenameText2 = filenameGroup2.add ("statictext", undefined, 'Scale 1: ');
			var filenameScale = filenameGroup2.add ("edittext", ([undefined,undefined,30,21]), '10');
			filenameText2.enabled = false;
			filenameScale.enabled = false;
	//----------------------------------------------------
	var folderPanel = mainGroup.add('panel',undefined , 'Folder', {borderStyle:'white'});
	var folderGroup = folderPanel.add ('group');
	folderGroup.orientation = 'row'
	var urlText = folderGroup.add ("statictext", ([undefined,undefined,256,21]), activeURL);
	var folderButton = folderGroup.add ("button", undefined, "Change");
	folderButton.onClick = function (){
		activeURL = Folder.selectDialog( 'Select folder.', folderPath);
		if(activeURL === null){
			urlText.text = 'Folder unavailable, select other location'
		}else{
			urlText.text = activeURL;
		}
	}
	//----------------------------------------------------
	aiRadio.onClick = function (){
		if(aiRadio.value === true){
			pdfRadio.value = false;
		}
	}
	pdfRadio.onClick = function (){
		if(pdfRadio.value === true){
			aiRadio.value = false;
		}
	}
	//----------------------------------------------------
	filenameArtboardRadio.onClick = function (){
		if(filenameArtboardRadio.value === true){
			filenameTextRadio.value = false;
			counterCheck.enabled = false;
			filenameText.enabled = false;
		}
	}
	filenameTextRadio.onClick = function (){
		if(filenameTextRadio.value === true){
			filenameArtboardRadio.value = false;
			counterCheck.enabled = true;
			filenameText.enabled = true;
		}
	}
	//----------------------------------------------------
	filenameSizeCheck.onClick = function (){
		if(filenameSizeCheck.value === true){
			filenameText2.enabled = true;
			filenameScale.enabled = true;
		}else{
			filenameText2.enabled = false;
			filenameScale.enabled = false;
		}
	}
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	w.show();
	//----------------------------------------------------
	if(filenameSizeCheck.value === true){
		filenameSize = true;
	}else{
		filenameSize = false;
	}
	if(filenameSizeCheck.value === true){
		filenameSize = true;
	}else{
		filenameSize = false;
	}
	//----------------------------------------------------
	if(aiRadio.value === true){
		filetypeInput = 'AI';
	}else if(pdfRadio.value === true){
		filetypeInput = 'PDF';
	}else{
		filetypeInput = 'DWG';
	}
	if(filenameArtboardRadio.value === true){
		filenamePrefix = 'artboard'
	}else{
		filenamePrefix = 'uniform'
	}
	if(counterCheck.value === true){
		filenameCounter = true;
	}else{
		filenameCounter = false;
	}
	//----------------------------------------------------
	scaleFactorInput  = (parseFloat(filenameScale.text));
	uniformName = filenameText.text
	//----------------------------------------------------
	return filetypeInput,filenamePrefix,filenameCounter,uniformName,filenameSize,scaleFactorInput;
}
//----------------------------------------------------
function outputFilename(artboard){
	urlString = activeURL + '/';
	//----------------------------------------------------
	if(filenamePrefix ==='artboard'){
		mainFilenameString = artboard.name;
	}else{
		mainFilenameString = uniformName;
		if(filenameCounter === true){
			mainFilenameString += ' ' + filenameCounterValue;
		}
	}
	//----------------------------------------------------
	var artWidth = artboard.artboardRect[0] - artboard.artboardRect[2];
	var artHeigth = artboard.artboardRect[1] - artboard.artboardRect[3];
	if(artWidth < 0){
		var artWidth = artWidth / -1;
	};
	if(artHeigth < 0){
		var artHeigth = artHeigth / -1;
	}		
	//----------------------------------------------------
	filenameSizeString = '';
	if(filenameSize === true){
		currentWidthStr = (artWidth * scaleFactorInput / units ).toFixed(0);
		currentHeightStr = (artHeigth * scaleFactorInput / units).toFixed(0);
		filenameSizeString += ' ' + currentWidthStr + 'x' + currentHeightStr + 'mm'
	}
	//----------------------------------------------------
	if(filetypeInput === 'AI'){
		filetypeString = '.ai';
	}else if(filetypeInput === 'PDF'){
		filetypeString = '.pdf';
	}else{
		filetypeString = '.dwg';
	}
	//----------------------------------------------------
	outputFilenameString = urlString + mainFilenameString + filenameSizeString + filetypeString;
	filenameCounterValue++;
	//----------------------------------------------------
	return outputFilenameString;
}
//----------------------------------------------------
function rulerOriginAdjustment(artboard){
	artboard.rulerOrigin = [artboard.artboardRect[0],
								-artboard.artboardRect[1]+neg2pos(artboard.artboardRect[1]-artboard.artboardRect[3])
								]
}