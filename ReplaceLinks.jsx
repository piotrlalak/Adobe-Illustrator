//-------------------------------------------------------
//$.writeln('ReplaceLinks.jsx')
initialConstants()
userInput()
main()
alert('Replaced ' + totalItemCounter + ' item(s)','ReplaceLinks.jsx')
//$.writeln('Replaced ' + totalItemCounter + ' item(s)')
//-------------------------------------------------------
function main(){
	selectionArray = app.activeDocument.selection
	if(doSomething === true){
		replaceLinks(selectionArray)
	}
}
//-------------------------------------------------------
function replaceLink(item){
	currentLink = item.file
	newLink = newLocation+stringReplacement(item.file.displayName,currentPrefix,newPrefix)
	newLink = stringReplacement(newLink," ","%20");
	if(checkURI(newLink) === true){
		//$.writeln('Replacing ' + currentLink + ' > ' + newLink)
		item.file = new File(newLink)
		totalItemCounter++
	}
}
//-------------------------------------------------------
function replaceLinks(selection){
	for(r=0;r<selection.length;r++){
		retrivePlacedItem(selection[r])
	}
}
//-------------------------------------------------------
function retrivePlacedItem(item){
	switch(item.typename){
		case 'PlacedItem':
				replaceLink(item)
			break;
		case 'GroupItem':
			for(var g=0;g<item.pageItems.length;g++){
				retrivePlacedItem(item.pageItems[g])
			}
			break;
		default:
			break;
	}
}
//-------------------------------------------------------
function stringReplacement(a,b,c){//a-string, b- target, c-replacement
	//---------------------------------
	originalString = a
	replacedString = '';
	//---------------------------------
	var a = a.toString();
	var b = b.toString();
	var c = c.toString();
	//---------------------------------
	var a = a.split('');
	var b = b.split('');
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
					if(c === undefined){
						continue
					}else{
						replacedString += c;
					}
				}
				//---------------------------------
			}
		}
		//---------------------------------
		if(matchedString === false && i < loopLength){
			if(c === undefined){
				continue
			}else{
				replacedString += a[i];
			}
		}
		//---------------------------------
	}
	//---------------------------------
	if(originalString === ''){
		replacedString = originalString
	}
	//---------------------------------
	return replacedString;
}
//-------------------------------------------------------
function initialConstants(){
	totalItemCounter = 0
	checkURL()
}
//-------------------------------------------------------
function checkURI(uri){
	currentFile = new File (uri)
	return currentFile.exists
}
//-------------------------------------------------------
function userInput(){
	newLocation = Folder('~')
	//----------------------------------------------------
	var w = new Window ('dialog',"ReplaceLinks.jsx");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//----------------------------------------------------
	var infoGroup = mainGroup.add ('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		static1 = infoGroup.add ("statictext", undefined, 'Script will replace all selected linked items with matching ones');
		static2 = infoGroup.add ("statictext", undefined, 'from provided folder using descripted identifiers (prefixes).');
	//----------------------------------------------------
	var filenamePanel = mainGroup.add('panel',undefined , 'Filename', {borderStyle:'white'});
	filenamePanel.orientation = 'column'
	filenamePanel.alignChildren = 'right'
		currentGroup = filenamePanel.add ('group');
		currentGroup.orientation = 'row'
			currentPrefixStatic = currentGroup.add ("statictext",undefined, 'Current Prefix:');
			currentPrefixInput = currentGroup.add ("edittext", ([undefined,undefined,300,21]), '');
		newGroup = filenamePanel.add ('group');
		newGroup.orientation = 'row'
			newPrefixStatic = newGroup.add ("statictext",undefined, 'New Prefix:');
			newPrefixInput = newGroup.add ("edittext", ([undefined,undefined,300,21]), '');
	//----------------------------------------------------
	var folderPanel = mainGroup.add('panel',undefined , 'Folder', {borderStyle:'white'});
	var folderGroup = folderPanel.add ('group');
	folderGroup.orientation = 'row'
	var urlText = folderGroup.add ("edittext", ([undefined,undefined,300,21]), stringReplacement(activeURL,'%20', ' '));
	var folderButton = folderGroup.add ("button", undefined, "Change");
	folderButton.onClick = function (){
		activeURL = Folder.selectDialog( 'Select folder.', folderPath);
		if(activeURL === null){
			urlText.text = 'Folder unavailable, select other location'
		}else{
			urlText.text = stringReplacement(activeURL,'%20', ' ');
		}
	}
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Replace Links");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	w.show();
	//----------------------------------------------------
	newLocation = activeURL.fullName + '/'
	currentPrefix = currentPrefixInput.text
	newPrefix = newPrefixInput.text
	//----------------------------------------------------
	return newLocation,currentPrefix,newPrefix,doSomething;
}
//-------------------------------------------------------
function checkURL(){
	if(app.documents.length == 0 ){
		alert('No documents open','ReplaceLinks.jsx - Error');
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