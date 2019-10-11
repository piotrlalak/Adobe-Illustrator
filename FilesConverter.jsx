//----------------------------------------------------
userInput();
//----------------------------------------------------
if(doSomething === true){
	convertFiles(fileArray(inputURL));
}else{
	//do nothing
}
//----------------------------------------------------
function convertFiles(array){
	for(a=0;a<array.length;a++){
		currentDocument = array[a];
		//----------------------------------------------------
		if(fileExists(currentDocument) === true){
			app.open(currentDocument,DocumentColorSpace.CMYK,openSettings());
		}else{
			continue
		}
		//$.writeln('File opened: ' + currentDocument.fullName);
		//----------------------------------------------------
		filetype = checkFiletype(array[a]);
		//$.writeln('Checked filetype: ' + filetype);
		//----------------------------------------------------
		destination = outputURL
		//----------------------------------------------------
		if(filetype === 'ai'){
			savePDF(destination);
			//$.writeln('>>>File saved: ' + destination);
		}else if(filetype === 'pdf'){
			saveAI(destination);
			//$.writeln('>>>File saved: ' + destination);
		}else{
			continue;
		}
		//----------------------------------------------------
	}
}
//----------------------------------------------------
function saveAI(destination){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------	
	saveOptions = SaveOptions.SAVECHANGES;
	//----------------------------------------------------
	newFile = new File(destination + '/' + document.name);
	//----------------------------------------------------
	document.saveAs(newFile);
	document.close(SaveOptions.DONOTSAVECHANGES);
	//----------------------------------------------------
}
//----------------------------------------------
function savePDF(destination){
	//----------------------------------------------------
	document = app.activeDocument;
	//----------------------------------------------------
	saveOptions = new PDFSaveOptions();
	saveOptions.artboardRange = '1';
	//----------------------------------------------------
	newFile = new File(destination + '/' + document.name);
	//----------------------------------------------------
	document.saveAs(newFile,saveOptions);
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
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"Update Files in the Folder");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	var infoGroup = mainGroup.add ('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
	static1 = infoGroup.add ("statictext", undefined, 'Saves AI to PDF and PDF to AI from one folder to another.');
	//static2 = infoGroup.add ("statictext", undefined, 'intput, then saves them in output folder.');
	//----------------------------------------------------
	var inputFolderPanel = mainGroup.add('panel',undefined , 'Input Folder', {borderStyle:'white'});
	var inputFolderGroup = inputFolderPanel.add ('group');
	inputFolderGroup.orientation = 'row'
	var inputURLText = inputFolderGroup.add ("statictext", ([undefined,undefined,500,21]), 'Select folder');
	var inputFolderButton = inputFolderGroup.add ("button", undefined, "Change");
	selectedInput = '~';
	//----------------------------------------------------
	var outputFolderPanel = mainGroup.add('panel',undefined , 'Output Folder', {borderStyle:'white'});
	var outputFolderGroup = outputFolderPanel.add ('group');
	outputFolderGroup.orientation = 'row'
	var outputURLText = outputFolderGroup.add ("statictext", ([undefined,undefined,500,21]), 'Select folder');
	var outputFolderButton = outputFolderGroup.add ("button", undefined, "Change");
	selectedOutput ='~';
	//----------------------------------------------------
	inputFolderButton.onClick = function (){
		inputURL = Folder.selectDialog( 'Select folder.', selectedInput);
		if(inputURL === null){
			inputURLText.text = 'Folder unavailable, select other location'
		}else{
			inputURLText.text = stringReplacement(inputURL,'%20',' '); //inputURL
			selectedInput = inputURL;
			//---------------
			outputURLText.text = stringReplacement(inputURL,'%20',' '); //outputURL
			outputURL = inputURL
			selectedOutput = outputURL;
			//---------------
		}
	}
	//----------------------------------------------------
	outputFolderButton.onClick = function (){
		outputURL = Folder.selectDialog( 'Select folder.', selectedOutput );
		if(outputURL === null){
			outputURLText.text = 'Folder unavailable, select other location'
		}else{
			outputURLText.text = stringReplacement(outputURL,'%20',' '); //outputURL
			selectedOutput = outputURL;
		}
	}
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Convert");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	w.show();
	//----------------------------------------------------
	return inputURL,outputURL;
}
//----------------------------------------------------
function stringReplacement(a,b,c){
	//---------------------------------
	replacedString = '';
	//---------------------------------
	a = a.toString();
	b = b.toString();
	c = c.toString();
	//---------------------------------
	a = a.split('');
	b = b.split('');
	//---------------------------------
	loopLength = a.length;
	if(b.length>loopLength){
		loopLength = b.length;
	}
	if(c.length>loopLength){
		loopLength = c.length;
	}
	//---------------------------------
	matchedString = false;
	//---------------------------------
	for(i=0;i<loopLength;i++){
		//---------------------------------
		if(a[i] === b[0]){
			for(ii=0;ii<b.length;ii++){
				if(a[i+ii] !== b[ii]){
					break;
				}
				//---------------------------------
				if(ii>=b.length-1){
					i = i + b.length;
					replacedString += c;
				}
				//---------------------------------
			}
		}
		//---------------------------------
		if(matchedString === false && i < loopLength){
			replacedString += a[i];
		}
		//---------------------------------
	}
	//---------------------------------
	return replacedString;
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