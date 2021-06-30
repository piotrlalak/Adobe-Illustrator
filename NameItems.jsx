//----------------------------------------------------
userInput()
nameItems()
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	activeURL = Folder('~')
	//----------------------------------------------------
	var window = new Window ('dialog',"Give Name To Items");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	prefixGroup = mainGroup.add('group');
	prefixGroup.orientation = 'column'
	prefixGroup.alignChildren = 'center'
		prefixStaticText = prefixGroup.add ("statictext", undefined,'Prefix');
		prefixEditText= prefixGroup.add ("edittext", [undefined,undefined,250,23], 'ASTXXXYYY');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	typeGroup = mainGroup.add('group');
	typeGroup.orientation = 'row'
	typeGroup.alignChildren = 'left'
		numberingRadio = typeGroup.add ("radiobutton", undefined,'Numbering');
		numberingRadio.value = true
		letteringRadio = typeGroup.add ("radiobutton", undefined,'Lettering');
		noneRadio = typeGroup.add ("radiobutton", undefined,'None (Sizing)');
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	startNumberGroup = mainGroup.add('group');
	startNumberGroup.orientation = 'row'
	startNumberGroup.alignChildren = 'left'
		startNumberStaticText = startNumberGroup.add ("statictext", undefined,'Start from: ');
		startNumberEditText= startNumberGroup.add ("edittext", [undefined,undefined,50,23], '1');
	paddingCheckBox = mainGroup.add ("checkbox", undefined,'Padded');
	paddingCheckBox.value = true
	//----------------------------------------------------
	divider3 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	asteriskCheckBox = mainGroup.add ("checkbox", undefined,'Asterisks (*)');
	asteriskCheckBox.value = false
	//----------------------------------------------------
	divider4 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	sizesCheckBox = mainGroup.add ("checkbox", undefined,'Sizes');
	sizesCheckBox.value = false
	sizesGroup = mainGroup.add('group');
	sizesGroup.orientation = 'row'
	sizesGroup.alignChildren = 'left'
		scaleStaticText = sizesGroup.add ("statictext", undefined,'Scale 1: ');
		inputScale= sizesGroup.add ("edittext", [undefined,undefined,50,23], '1');
	//----------------------------------------------------
	divider4 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	numberingRadio.onClick = function (){
		prefixGroup.enabled = true
		startNumberGroup.enabled = true
		paddingCheckBox.enabled = true
	}
	letteringRadio.onClick = function (){
		prefixGroup.enabled = true
		startNumberGroup.enabled = false
		paddingCheckBox.enabled = false
	}
	noneRadio.onClick = function (){
		prefixGroup.enabled = false
		startNumberGroup.enabled = false
		paddingCheckBox.enabled = false
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	if(numberingRadio.value === true){
		suffixType = 0
	}else if(letteringRadio.value === true) {
		suffixType = 1
	}else{
		suffixType = 2
	}
	startNumberInput = parseInt(startNumberEditText.text)
	prefixString = prefixEditText.text
	padding = paddingCheckBox.value
	asterisks = asteriskCheckBox.value
	sizes = sizesCheckBox.value
	scale= 1/(parseInt(inputScale.text))
	//----------------------------------------------------
	return suffixType,startNumberInput,prefixString,padding,asterisks,sizes,scale,doSomething;
}
//----------------------------------------------------
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
//----------------------------------------------------
function nameItems(){
	if(app.documents.length>0){
		if(app.activeDocument.selection.length > 0){
			if(doSomething === true){			
				for(a=0;a<app.activeDocument.selection.length;a++){
					//----------------------------------------------------
					if(padding===true){
						padLenght = app.activeDocument.selection.length < 100 ? 2 : 3;
						number = pad((a+startNumberInput),padLenght)
					}else{
						number = (a+startNumberInput)
					}
					//----------------------------------------------------
					if(suffixType === 0){
						tempName = prefixString+number.toString()
					}else if(suffixType === 1){
						tempName = prefixString+numberToLetter(a)
					}else{
						tempName = ''
					}
					//----------------------------------------------------
					if(asterisks===true){
						tempName = '*'+ tempName + '*'
					}
					//----------------------------------------------------
					if(sizes===true){
						units = (72/25.4)*scale;
						width = (app.activeDocument.selection[a].width / units).toFixed(0)
						height = (app.activeDocument.selection[a].height / units).toFixed(0)
						itemsize = width + ' x ' + height
						spacing = ''
						if(tempName.length > 0){
							spacing = ' '
						}
						tempName = tempName + spacing + itemsize
					}	
					app.activeDocument.selection[a].name = tempName
				}
			}
		}
	}
}
//----------------------------------------------------
function numberToLetter(v){
	//----------------------------------------------------
	alphabet= ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')
	vLength = parseInt(Math.floor(v/26),10)
	if(v<alphabet.length){
		letter = alphabet[v]
	}else{
		letter =  alphabet[vLength-1] + alphabet[v-(26 * vLength)]
	}
	if(v > 676){
		letter = v
	}
	//----------------------------------------------------
	return letter
}