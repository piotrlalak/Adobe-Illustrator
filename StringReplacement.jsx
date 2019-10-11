//----------------------------------------------------
counters()
userInputMode()
if(app.activeDocument === undefined){
	doSomething = false
}
//----------------------------------------------------
if(doSomething === true){
	$.writeln('\nReplacing Strings...\n')
	if(artboardsBool === true){
		//$.writeln('Looking for artboards')
		for(var a=0;a<app.activeDocument.artboards.length;a++){
			tempName = stringReplacement(app.activeDocument.artboards[a].name,inputString,outputString)
			app.activeDocument.artboards[a].name = tempName
			/*$.writeln('Artboard__ > Input: '
						+ app.activeDocument.artboards[a].name
						+ '  |  Output: '
						+ tempName)*/
		}
	}
	//$.writeln('Looking for layers')
	for(var a=0;a<app.activeDocument.layers.length;a++){
		layerItems(app.activeDocument.layers[a])
		/*
		//----------------------------------------------------
		if(layersBool === true){
			tempName = stringReplacement(app.activeDocument.layers[a].name,inputString,outputString)
			app.activeDocument.layers[a].name = tempName
			$.writeln('Layer______ > Input: '
						+ app.activeDocument.layers[a].name
						+ '  |  Output: '
						+ tempName)
		}
		//----------------------------------------------------
		if(itemsBool === true){
			$.writeln('Looking for items')
			for(var b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
				itemNames(app.activeDocument.layers[a].pageItems[b])
			}
		}
		//----------------------------------------------------
		if(textFramesBool === true){
			$.writeln('Looking for text frames')
			for(var b=0;b<app.activeDocument.layers[a].pageItems.length;b++){
				textFrameContent(app.activeDocument.layers[a].pageItems[b])
			}
		}
		//----------------------------------------------------
		*/
	}
}
$.writeln('\n')
alert('Replaced ' + totalC + ' strings.')
//----------------------------------------------------
function userInputMode(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"String Replacement");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	inputGroup = mainGroup.add('group');
	inputGroup.orientation = 'column'
	inputGroup.alignChildren = 'center'
		inputStaticText = inputGroup.add ("statictext", undefined,'Input Name String');
		inputEditText= inputGroup.add ("edittext", [undefined,undefined,200,23], 'XXX');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	outputGroup = mainGroup.add('group');
	outputGroup.orientation = 'column'
	outputGroup.alignChildren = 'center'
		outputStaticText = outputGroup.add ("statictext", undefined,'Output Name String');
		outputEditText= outputGroup.add ("edittext", [undefined,undefined,200,23], 'YYY');
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	modesGroup = mainGroup.add('group');
	modesGroup.orientation = 'column'
	modesGroup.alignChildren = 'left'
		artboardsBox = modesGroup.add ('checkbox',undefined,'Artboards');
		artboardsBox.value = true
		layersBox = modesGroup.add ('checkbox',undefined,'Layers');
		layersBox.value = true
		itemsBox = modesGroup.add ('checkbox',undefined,'Items');
		itemsBox.value = true
		textFramesBox = modesGroup.add ('checkbox',undefined,'Text Frames');
		textFramesBox.value = true
	//----------------------------------------------------
	divider3 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = window.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	inputString = inputEditText.text
	outputString = outputEditText.text
	artboardsBool = artboardsBox.value
	layersBool = layersBox.value
	itemsBool = itemsBox.value
	textFramesBool = textFramesBox.value
	//----------------------------------------------------
	return inputString,outputString,artboardsBool,layersBool,itemsBool,textFramesBool,doSomething;
}
//----------------------------------------------------
function itemNames(item){
	//$.writeln('--------------->  itemNames')
	switch(item.typename){
		case 'GroupItem':
			if(itemsBool === true){
				tempName = stringReplacement(item.name,inputString,outputString)
				//$.writeln('Item       > Input: ' + item.name + '  |  Output: ' + tempName)
				item.name = tempName
			}
			for(var c = 0;c<item.pageItems.length;c++){
				itemNames(item.pageItems[c])
			}
			break;
		default:
			tempName = stringReplacement(item.name,inputString,outputString)
			//$.writeln('Item______ > Input: ' + item.name + '  |  Output: ' + tempName)
			item.name = tempName
			break;
	}
}
//----------------------------------------------------
function textFrameContent(item){
	//$.writeln('--------------->  textFrameContent')
	switch(item.typename){
		case 'GroupItem':
			for(var c = 0;c<item.pageItems.length;c++){
				textFrameContent(item.pageItems[c])
			}
			break;
		case 'TextFrame':
			tempName = stringReplacement(item.contents,inputString,outputString)
			$.writeln('Text Frame > Input: ' + item.contents + '  |  Output: ' + tempName)
			item.contents = tempName
			break;
		default:
			break;
	}
}
//----------------------------------------------------
function stringReplacement(a,b,c){//a-string, b- target, c-replacement
	//$.writeln('--------------->  stringReplacement')
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
	}else{
		totalC++
	}
	//---------------------------------
	return replacedString;
}
//----------------------------------------------------
function layerItems(layer){
	//$.writeln('--------------->  layerItems')
	if(layer.layers.length < 1){
		//----------------------------------------------------
		if(layersBool === true){
			tempName = stringReplacement(layer.name,inputString,outputString)
			layer.name = tempName
			/*$.writeln('Layer______ > Input: '
						+ layer.name
						+ '  |  Output: '
						+ tempName)*/
		}
		//----------------------------------------------------
		if(itemsBool === true){
			//$.writeln('Looking for items')
			for(var b=0;b<layer.pageItems.length;b++){
				itemNames(layer.pageItems[b])
			}
		}
		//----------------------------------------------------
		if(textFramesBool === true){
			//$.writeln('Looking for text frames')
			for(var b=0;b<layer.pageItems.length;b++){
				textFrameContent(layer.pageItems[b])
			}
		}
	}else{
		for(var b=0;b<layer.layers.length;b++){
			layerItems(layer.layers[b])
		}
	}
}
//----------------------------------------------------
function counters(){
	totalC = 0
}