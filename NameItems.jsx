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
		prefixEditText= prefixGroup.add ("edittext", [undefined,undefined,200,23], 'ASTXXXYYY');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	typeGroup = mainGroup.add('group');
	typeGroup.orientation = 'row'
	typeGroup.alignChildren = 'left'
		numberingRadio = typeGroup.add ("radiobutton", undefined,'Numbering');
		numberingRadio.value = true
		letteringRadio = typeGroup.add ("radiobutton", undefined,'Lettering');
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
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	numberingRadio.onClick = function (){
		startNumberGroup.enabled = true
		paddingCheckBox.enabled = true
	}
	letteringRadio.onClick = function (){
		startNumberGroup.enabled = false
		paddingCheckBox.enabled = false
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	if(numberingRadio.value === true){
		suffixType = 0
	}else{
		suffixType = 1
	}
	startNumberInput = parseInt(startNumberEditText.text)
	prefixString = prefixEditText.text
	padding = paddingCheckBox.value
	asterisks = asteriskCheckBox.value
	//----------------------------------------------------
	return suffixType,startNumberInput,prefixString,padding,asterisks,doSomething;
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
					}else{
						tempName = prefixString+numberToLetter(a)
					}
					//----------------------------------------------------
					if(asterisks===true){
						tempName = '*'+ tempName + '*'
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