userInput()
randomizeFonts()
//----------------------------------------------------
function randomizeFonts(){
	if(doSomething === true){
		for(a=0;a<app.activeDocument.selection.length;a++){
			randomFont = app.textFonts[getRandomInt(0, (app.textFonts.length-1))]
			if(app.activeDocument.selection[a].typename === 'TextFrame'){
				$.writeln('Selected is a TextFrame: "' + app.activeDocument.selection[a].contents + '" | Random font: ' + randomFont)
				app.activeDocument.selection[a].textRange.characterAttributes.textFont = randomFont
			}
		}
	}
}
//----------------------------------------------------
function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"RandomizeFonts");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will apply random font');
		info2 = infoGroup.add ("statictext", undefined,'to every text frame selected.');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,120,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	return doSomething;
}