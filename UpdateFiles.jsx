//----------------------------------------------------
userInput();
//----------------------------------------------------
if(doSomething === true){
	updateFiles(fileArray(activeURL));
}else{
	//do nothing
}
//----------------------------------------------------
function updateFiles(array){
	for(a=0;a<array.length;a++){
		currentDocument = array[a];
		//----------------------------------------------------
		//check if files still in the folder
		if(fileExists(currentDocument) === true){
			app.open(currentDocument,DocumentColorSpace.CMYK,openSettings());
		}else{
			continue
		}
		//$.writeln('File opened: ' + currentDocument.name);
		//----------------------------------------------------
		filetype = checkFiletype(array[a]);
		//$.writeln('Checked filetype: ' + filetype);

		//----------------------------------------------------
		if(filetype === 'ai'){
			saveAI();
		}else if(filetype === 'pdf'){
			savePDF();
		}else{
			continue;
		}
		//----------------------------------------------------
	}
}
//----------------------------------------------------
function saveAI(){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------	
	saveOptions = SaveOptions.SAVECHANGES;
	document.save(saveOptions);
	closeOptions = SaveOptions.DONOTSAVECHANGES;
	document.close(closeOptions);
	//----------------------------------------------------
}
//----------------------------------------------
function savePDF(){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------
	saveOptions = new PDFSaveOptions();
	saveOptions.artboardRange = '1';
	//----------------------------------------------------
	filename = document.fullName;
	document.saveAs(document.fullName,saveOptions);
	closeOptions = SaveOptions.DONOTSAVECHANGES;
	document.close(closeOptions);
	//----------------------------------------------------
}
//----------------------------------------------------
function openSettings(){
	openOptions = new OpenOptions();
	openOptions.updateLegacyGradientMesh = true;
	return openOptions;
}
//----------------------------------------------------
function fileArray(url){
	//----------------------------------------------------
	firstArrayType = '*.ai';
	secondArrayType = '*.pdf';
	firstArray = url.getFiles(firstArrayType);
	secondArray = url.getFiles(secondArrayType);
	updateFileArray = new Array (firstArray.length + secondArray.length);
	//----------------------------------------------------
	for(a=0;a<updateFileArray.length;a++){
		if(a<firstArray.length){
			updateFileArray[a] = firstArray[a]
		}else{
			updateFileArray[a] = secondArray[a-firstArray.length];
		}
	}
	//----------------------------------------------------
	updateFileArray.sort();
	return updateFileArray;
}
//----------------------------------------------
function checkFiletype(document){
	//----------------------------------------------
	filetype = null;
	//----------------------------------------------
	documentPath = (document.fullName).toString();
	documentPathArray = documentPath.split('.');
	documentExtension = documentPathArray[documentPathArray.length-1];
	//----------------------------------------------
	if(documentExtension === 'ai'){
		filetype = 'ai';
	}else{
		filetype = 'pdf';
	}
	//----------------------------------------------
	return filetype;
}
//----------------------------------------------
function flickLayer(document){
	if(document.layers[0].locked === true){
		document.layers[0].locked = false;
		document.layers[0].locked = true;
	}else{
		document.layers[0].locked = true;
		document.layers[0].locked = false;
	}
}
//----------------------------------------------------
function userInput(){
	activeURL = Folder('~')
	//activeURL = 'Select folder'
	//----------------------------------------------------
	var w = new Window ('dialog',"Update Files in the Folder");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	var infoGroup = mainGroup.add ('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
	static1 = infoGroup.add ("statictext", undefined, 'Script will open all AI and PDF files in');
	static2 = infoGroup.add ("statictext", undefined, 'selected folder, then overwrite and close them');
	//----------------------------------------------------
	var folderPanel = mainGroup.add('panel',undefined , 'Folder', {borderStyle:'white'});
	var folderGroup = folderPanel.add ('group');
	folderGroup.orientation = 'row'
	var urlText = folderGroup.add ("statictext", ([undefined,undefined,195,21]), activeURL);
	var folderButton = folderGroup.add ("button", undefined, "Change");
	folderButton.onClick = function (){
		activeURL = Folder.selectDialog( 'Select folder.', '~' );
		if(activeURL === null){
			urlText.text = 'Folder unavailable, select other location'
		}else{
			urlText.text = activeURL;
		}
	}
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Overwrite");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	w.show();
	//----------------------------------------------------
	return activeURL;
}
//----------------------------------------------------
function fileExists(filename){
	tempFile = new File(filename.fullName)
	
	if(tempFile.exists === true){
		$.writeln('Found file: ' + (((filename.fullName).split("/"))[(((filename.fullName).split("/")).length-1)]) )
	}else{
		$.writeln('Missing : ' + (((filename.fullName).split("/"))[(((filename.fullName).split("/")).length-1)]) )
	}

	return tempFile.exists
}