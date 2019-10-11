//-----------------------------------------------------------------------------------------------------------------------------------
initialConstants()
userInput()
if(doSomething === true){
	setAllItemsInvisible()
	itemsToJpgs()
	//-------------------------------------------------------------
	app.activeDocument.artboards[0].artboardRect = initialArtboardRect
	setAllItemsVisible()
	//-------------------------------------------------------------
	//app.activeDocument.save();//development only
}else{
	//do nothing
}
//-----------------------------------------------------------------------------------------------------------------------------------
function exportToJPG(scale,filename){
	//-------------------------------------------------------------
	if(scale > 7.7619){
		scale = 7.7619
	}
	if(scale < 0){
		scale = 0
	}
	//-------------------------------------------------------------
	switch (filetypeExport){
		case 0:
			var exportOptions = new ExportOptionsJPEG();
			exportOptions.antiAliasing = true;
			exportOptions.artBoardClipping = true;
			exportOptions.horizontalScale = scale*100;
			exportOptions.verticalScale = scale*100;
			exportOptions.qualitySetting = 100;
			type = ExportType.JPEG;
			fileSpec = new File(filename);
			break;
		case 1:
			var exportOptions = new ExportOptionsPNG24();
			exportOptions.antiAliasing = true;
			exportOptions.artBoardClipping = true;
			exportOptions.horizontalScale = scale*100;
			exportOptions.verticalScale = scale*100;
			exportOptions.transparency = true;
			type = ExportType.PNG24;
			fileSpec = new File(filename);
			break;
		case 2:
			var exportOptions = new ExportOptionsTIFF();
			exportOptions.resolution = 72;
			exportOptions.byteOrder = TIFFByteOrder.IBMPC;
			exportOptions.IZWCompression = false;
			exportOptions.imageColorSpace = ImageColorSpace.CMYK;
			type = ExportType.TIFF;
			fileSpec = new File(filename + '.tiff');
			break;
		default:
			var exportOptions = new ExportOptionsJPEG();
			exportOptions.antiAliasing = true;
			exportOptions.artBoardClipping = true;
			exportOptions.horizontalScale = scale*100;
			exportOptions.verticalScale = scale*100;
			exportOptions.qualitySetting = 100;
			type = ExportType.JPEG;
			fileSpec = new File(filename);
			break;
		}
	//-------------------------------------------------------------
	app.activeDocument.exportFile(fileSpec,type,exportOptions);
}
//-----------------------------------------------------------------------------------------------------------------------------------
function artboardSize(item,margin,outputWidth,outputHeight){
	//-------------------------------------------------------------
	if(item.typename ==='GroupItem'){
		if(item.clipped === true){
			item =  item.pageItems[0];
		}
	}
	//-------------------------------------------------------------
	iniOutWidth = outputWidth;
	iniOutHeight = outputHeight;
	outputWidth = (outputWidth - (margin*2))/units;
	outputHeight = (outputHeight - (margin*2))/units;
	inputWidth = itemProperties(item)[0]/units
	inputHeight = itemProperties(item)[1]/units
	//-------------------------------------------------------------
	hScale = ((outputWidth*100) / inputWidth)/100
	vScale =((outputHeight*100) / inputHeight)/100
	//-------------------------------------------------------------
	outputRatio = outputWidth / outputHeight;
	inputRatio = inputWidth / inputHeight
	inOutRatio = ((outputRatio*100) / inputRatio)/100
	//-------------------------------------------------------------
	outputRatioH = outputHeight / outputWidth;
	inputRatioH = inputHeight / inputWidth
	inOutRatioH = ((outputRatioH*100) / inputRatioH)/100
	//-------------------------------------------------------------
	if(inputRatio > outputRatio){
		scaleFactor = hScale
	}else{
		scaleFactor = vScale
	}
	artboardScale = scaleFactor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	if(artboardRatio === true){
		hBleed = (((inputWidth * units)*inOutRatio)-(inputWidth * units))/2;
		vBleed = (((inputHeight * units)*inOutRatioH)-(inputHeight * units))/2;
	}else{
		hBleed = 0;
		vBleed = 0;
	}
	scaledBounds = (margin/artboardScale)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//-------------------------------------------------------------
	if (inputRatio < outputRatio){
		hOffset =scaledBounds + hBleed
		vOffset = scaledBounds
		newRect = [(item.visibleBounds[0])-hOffset,
						(item.visibleBounds[1])+vOffset,
						(item.visibleBounds[2])+hOffset,
						(item.visibleBounds[3])-vOffset
						];
	}else{
		hOffset = scaledBounds
		vOffset = scaledBounds + vBleed
		newRect = [(item.visibleBounds[0])-hOffset,
						(item.visibleBounds[1])+vOffset,
						(item.visibleBounds[2])+hOffset,
						(item.visibleBounds[3])-vOffset
						];
	}
	//-------------------------------------------------------------
	jpgWidth = (newRect[2]-newRect[0])/units;
	jpgHeight = (newRect[3]-newRect[1])/units;
	if(jpgWidth < 0){
		jpgWidth = jpgWidth / -1
	}
	if(jpgHeight < 0){
		jpgHeight = jpgHeight / -1
	}
	//-------------------------------------------------------------
	/*
	actionCounter++
	$.writeln('Item ' + actionCounter + '---------------------------------')
	
	$.write('Target Width: ' + (outputWidth*units).toFixed(0) + 'px (' + (outputWidth).toFixed(2) + 'mm) - ');
	$.write('Input (Scaled): ' + (inputWidth*artboardScale*units).toFixed(0));
	$.writeln('px (' + (inputWidth).toFixed(2) + 'mm)');
	
	$.write('Target Height: ' + (outputHeight*units).toFixed(0) + 'px (' + (outputHeight).toFixed(2) + 'mm) - ');
	$.write('Input (Scaled): ' + (inputHeight*artboardScale*units).toFixed(0));
	$.writeln('px (' + (inputHeight).toFixed(2) + 'mm)');
	
	$.writeln('Blank width offset: ' + (hOffset*artboardScale).toFixed(0) + 'px (' + (hOffset/units).toFixed(2) + 'mm)');
	$.writeln('Blank heigth offset: ' + (vOffset*artboardScale).toFixed(0) + 'px (' + (vOffset/units).toFixed(2) + 'mm)');
	
	$.write('Output Resolution: ' + ((jpgWidth*(artboardScale))*units).toFixed(0) + 'px ('+ (jpgWidth).toFixed(2));
	$.writeln('mm) x ' +  ((jpgHeight*(artboardScale))*units).toFixed(0) + 'px (' + (jpgHeight).toFixed(2) + 'mm)');
	
	$.writeln('Horizontal Scale Factor: ' + (hScale).toFixed(4));
	$.writeln('Vertical Scale Factor: ' + (vScale).toFixed(4));
	$.writeln('Ratio Scale Factor: ' + (inOutRatio).toFixed(4));
	
	$.writeln('---------------------------------------')
	$.writeln('');
	*/
	//-------------------------------------------------------------
	return newRect,artboardScale;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function itemsToJpgs(){
	counter = 1
	for(a=0;a<app.activeDocument.layers.length;a++){
		//-------------------------------------------------------------
		if(filenameLayer === true){
			counter = 1;
		}
		//-------------------------------------------------------------
		if(app.activeDocument.layers[a].locked === true){
			continue;
		}else{
			for(b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
				//-------------------------------------------------------------
				currentItem = app.activeDocument.layers[a].pageItems[b];
				if(currentItem.locked === true){
					continue;
				}
				//-------------------------------------------------------------
				if(itemVisibility === false){
					currentItem.hidden = false;
				}
				if(currentItem.width <= 0 || currentItem.height <= 0){
					if(itemVisibility === false){
						currentItem.hidden = true;
					}
					continue;
				}
				//-------------------------------------------------------------
				filenamePathString = '';
				filenameLayerString = '';
				filenameSizeString = '';
				if(filenamePath === true){
					filenamePathString = ' ' + currentItem.name;
				}
				if(filenameLayer === true){
					filenameLayerString = ' ' + app.activeDocument.layers[a].name;// + ' ' + counter;
				}
				if(filenameSize === true){
					currentWidthStr = (currentItem.width * scaleFactorInput / units ).toFixed(0);
					currentHeightStr = (currentItem.height * scaleFactorInput / units).toFixed(0);
					filenameSizeString += ' ' + currentWidthStr + 'x' + currentHeightStr + 'mm'
				}
				if(counterNameString === true){
					counterString = ' ' + counter
				}else{
					counterString = '';
				}
				//-------------------------------------------------------------
				artboardSize(currentItem,margin,resolutionWidth,resolutionHeight)
				app.activeDocument.artboards[0].artboardRect = newRect;
				finalFilenameString = inputFilename + filenamePathString + filenameLayerString + counterString + filenameSizeString;
				exportToJPG(artboardScale,activeURL + '/' + replaceCharacter(finalFilenameString,' ','_'));
				//-------------------------------------------------------------
				counter++;
				//-------------------------------------------------------------
				if(itemVisibility === false){
					currentItem.hidden = true;
				}
			}
		}
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function replaceCharacter(inputString,targetSymbol,replacementSymbol){
	outputString = '';
	for(n=0; n<inputString.split('').length;n++){
		if(inputString.split('')[n] === targetSymbol){
			outputString += replacementSymbol;
		}else{
			outputString += inputString.split('')[n];
		}
	}
	return outputString;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function documentToLayers(){
	for(a=0;a<app.activeDocument.layers.length;a++){	
		artboardToLayerItems(app.activeDocument.layers[a])
	}
	removeArtboard(app.activeDocument.artboards.length/app.activeDocument.artboards.length-1)
}
//-----------------------------------------------------------------------------------------------------------------------------------
function artboardToLayerItems(layer){
	for(b=0;b<layer.pageItems.length;b++){	
		artboardToPageItem(layer.pageItems[b])
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function artboardToPageItem(item){
	var newArtboard = app.activeDocument.artboards.add([item.visibleBounds[0],
																			item.visibleBounds[1],
																			item.visibleBounds[2],
																			item.visibleBounds[3]
																			]);
	newArtboard.name = item.name
}
//-----------------------------------------------------------------------------------------------------------------------------------
function removeArtboard(artboardIndex){
	if(app.activeDocument.artboards.length > 1){
		app.activeDocument.artboards[artboardIndex].remove();
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function initialConstants(){
	actionCounter = 0;
	doSomething = false;
	units = 72 / 25.4;
	initialArtboardRect = app.activeDocument.artboards[0].artboardRect;
	margin = 10;
	thumbnailRatio = (840 - margin) / (460 - margin);
	checkURL();
}
//-----------------------------------------------------------------------------------------------------------------------------------
function checkRatio(item){
	itemBounds = item.visibleBounds;
	itemWidth = itemBounds[0] - itemBounds[2];
	if(itemWidth < 0){
		itemWidth = itemWidth / -1;
	}
	itemHeight = itemBounds[1] - itemBounds[3];
	if(itemHeight < 0){
		itemHeight = itemHeight / -1;
	}
	itemSizeRatio = itemWidth / itemHeight;
	$.writeln(itemSizeRatio)
	return itemSizeRatio;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function userInput(){
	var w = new Window ('dialog',"Objects to JPG's");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//-------------------------------------------------------------
	var resolutionGroup = mainGroup.add ('group');
	resolutionGroup.orientation = 'row'
		var widthPanel = resolutionGroup.add('panel',undefined , 'Width', {borderStyle:'white'});
		widthPanel.orientation = 'row'
		var inputWidth = widthPanel.add ("edittext", ([undefined,undefined,50,17]), '840');
		var unitsText = widthPanel.add ("statictext", undefined, 'px');
		//-------------------------------------------------------------
		var heigthPanel = resolutionGroup.add('panel',undefined , 'Heigth', {borderStyle:'white'});
		heigthPanel.orientation = 'row'
		var inputHeight = heigthPanel.add ("edittext", ([undefined,undefined,50,17]), '460');
		var unitsText = heigthPanel.add ("statictext", undefined, 'px');
	//-------------------------------------------------------------
	var marginPanel = resolutionGroup.add('panel',undefined , 'Margin', {borderStyle:'white'});
	marginPanel.orientation = 'row'
	var inputMargin = marginPanel.add ("edittext", ([undefined,undefined,30,21]), '50');
	var unitsText = marginPanel.add ("statictext", undefined, 'px');
	//-------------------------------------------------------------
	var itemVisibilityPanel = mainGroup.add('panel',undefined , 'Item Visibility', {borderStyle:'white'});
	var itemVisibilityGroup = itemVisibilityPanel.add ('group');
	itemVisibilityGroup.orientation = 'row'
	var itemVisibilityRadio1 = itemVisibilityGroup.add ("radiobutton", undefined, "All Visible");
	var itemVisibilityRadio2 = itemVisibilityGroup.add ("radiobutton", undefined, "Active Layer");
	itemVisibilityRadio1.value = true;
	//-------------------------------------------------------------
	var artboardPanel = mainGroup.add('panel',undefined , 'Artboard', {borderStyle:'white'});
	var artboardGroup = artboardPanel.add ('group');
	artboardGroup.orientation = 'row'
	var artboardRadio1 = artboardGroup.add ("radiobutton", undefined, "Fill ( Constant size )");
	var artboardRadio2 = artboardGroup.add ("radiobutton", undefined, "Crop ( Width / Height )");
	artboardRadio1.value = true;
	//-------------------------------------------------------------
	var filetypePanel = mainGroup.add('panel',undefined , 'Filetype', {borderStyle:'white'});
	var filetypeGroup = filetypePanel.add ('group');
	artboardGroup.orientation = 'row'
	var filetypeRadio1 = filetypeGroup.add ("radiobutton", undefined, "JPG");
	var filetypeRadio2 = filetypeGroup.add ("radiobutton", undefined, "PNG (Transparent)");
	var filetypeRadio3 = filetypeGroup.add ("radiobutton", undefined, "TIFF (CMYK)");
	var filetypeStatic1 = filetypePanel.add ("statictext", undefined, 'Both JPG and PNG files are RGB colour space only.');
	var filetypeStatic2 = filetypePanel.add ("statictext", undefined, 'TIFF function under development. Constant dpi of 72');
	var filetypeStatic3 = filetypePanel.add ("statictext", undefined, 'fluctuates final pixel resolution. Use on your own risk');
	filetypeRadio1.value = true;
	//-------------------------------------------------------------
	var filenamePanel = mainGroup.add('panel',undefined , 'Filename', {borderStyle:'white'});
	filenamePanel.alignChildren = 'LEFT'
	var filenameGroup = filenamePanel.add ('group');
	filenameGroup.orientation = 'row'
	filenameGroup.alignChildren = 'CENTER'
	var filenameText = filenameGroup.add ("edittext", ([undefined,undefined,290,21]), app.activeDocument.name.split('.')[0]);
	var filenamePathName = filenamePanel.add ("checkbox", undefined, '+ Path Name (Optional)');
	var filenameLayerName = filenamePanel.add ("checkbox", undefined, '+ Layer Name (Optional)');
	var counterName = filenamePanel.add ("checkbox", undefined, '+ Number (Optional)');
	//var counterText = filenamePanel.add ("statictext", undefined, '+ Number (Required)');
	var filenameGroup2 = filenamePanel.add ('group');
	filenameGroup2.orientation = 'row'
	filenameGroup2.alignChildren = 'center'	
	var filenameSizeCheck = filenameGroup2.add ("checkbox", undefined, '+ Item size (Optional)');
	var filenameText2 = filenameGroup2.add ("statictext", undefined, 'Scale 1: ');
	var filenameScale = filenameGroup2.add ("edittext", ([undefined,undefined,30,21]), '1');
	filenameText2.enabled = false;
	filenameScale.enabled = false;
	//-------------------------------------------------------------
	var folderPanel = mainGroup.add('panel',undefined , 'Folder', {borderStyle:'white'});
	var folderGroup = folderPanel.add ('group');
	folderGroup.orientation = 'row'
	var urlText = folderGroup.add ("statictext", ([undefined,undefined,195,21]), activeURL);
	var folderButton = folderGroup.add ("button", undefined, "Change");
	folderButton.onClick = function (){
		activeURL = Folder.selectDialog( 'Select folder.', folderPath);
		if(activeURL === null){
			urlText.text = 'Folder unavailable, select other location'
		}else{
			urlText.text = activeURL;
		}
	}
	//-------------------------------------------------------------
	filenameSizeCheck.onClick = function (){
		if(filenameSizeCheck.value === true){
			filenameText2.enabled = true;
			filenameScale.enabled = true;
		}else{
			filenameText2.enabled = false;
			filenameScale.enabled = false;
		}
	}
	//-------------------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	w.show();
	//-------------------------------------------------------------
	scaleFactorInput  = (parseFloat(filenameScale.text));
	resolutionWidth  = (parseInt(inputWidth.text));
	resolutionHeight  = (parseInt(inputHeight.text));
	margin  = (parseInt(inputMargin.text));
	if(filenamePathName.value === true){
		filenamePath = true;
	}else{
		filenamePath = false;
	}
	if(filenameLayerName.value === true){
		filenameLayer = true;
	}else{
		filenameLayer = false;
	}
	if(counterName.value === true){
		counterNameString = true;
	}else{
		counterNameString = false;
	}
	if(filenameSizeCheck.value === true){
		filenameSize = true;
	}else{
		filenameSize = false;
	}
	if(itemVisibilityRadio1.value === true){
		itemVisibility = true;
	}else{
		itemVisibility = false;
	}
	if(artboardRadio1.value === true){
		artboardRatio = true;
	}else{
		artboardRatio = false;
	}
	if(filetypeRadio1.value === true){
		filetypeExport = 0
	}
	if(filetypeRadio2.value === true){
		filetypeExport = 1
	}
	if(filetypeRadio3.value === true){
		filetypeExport = 2
	}
	inputFilename = filenameText.text
	//-------------------------------------------------------------
	return counterNameString,itemVisibility,filenamePath,filenameLayer,filenameSize,scaleFactorInput,resolutionWidth,resolutionHeight,margin,activeURL,inputFilename,artboardRatio,filetypeExport;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function checkURL(){
	if(app.activeDocument.path != 0){
		activeURL = app.activeDocument.path;
		folderPath = activeURL
	}else{
		activeURL = 'Select folder';
		folderPath = '~'
	}
	return activeURL,folderPath;
}
//-----------------------------------------------------------------------------------------------------------------------------------
function setAllItemsInvisible(){
	if(itemVisibility === false){
		for(a=0;a<app.activeDocument.layers.length;a++){
			if(app.activeDocument.layers[a].locked === true){
				continue;
			}else{
				for(b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
					app.activeDocument.layers[a].pageItems[b].hidden = true;
				}
			}
		}
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function setAllItemsVisible(){
	if(itemVisibility === false){
		for(a=0;a<app.activeDocument.layers.length;a++){	
			if(app.activeDocument.layers[a].locked === true){
				continue;
			}else{
				for(b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
					app.activeDocument.layers[a].pageItems[b].hidden = false;
				}
			}
		}
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function hideItem(item){
	switch (itemVisibility){
	}
}
//-----------------------------------------------------------------------------------------------------------------------------------
function itemProperties(item){
	width = item.visibleBounds[2] - item.visibleBounds[0];
	if(width < 0){
		width = width / -1 
	}
	height = item.visibleBounds[3] - item.visibleBounds[1];
	if(height < 0){
		height = height / -1 
	}
	currentItemProperties = [width,height]
	return currentItemProperties;
}
