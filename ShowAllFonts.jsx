userInput()
showAllFonts()
//----------------------------------------------------
function showAllFonts(){
	if(doSomething === true){
		//$.writeln('No of fonts: ' + app.textFonts.length + ' | ' + inputStringText)
		font_length = app.textFonts.length		
		widthOffset = 200 * 1.350913217
		heightOffset = 10 * 1.350913217		
		n_rows = 10
		n_cols = Math.ceil(font_length / n_rows)
		f_counter = 0
		
		for(a=0;a<n_rows;a++){
			
			for(b=0;b<n_cols;b++){
				
				if(inputStringText==''){
					display_text = app.textFonts[f_counter].name
				}else{
					display_text = inputStringText
				}
				
				if(f_counter < font_length){
					pointTextInfo(display_text,app.textFonts[f_counter],a + a*widthOffset,b - b*heightOffset,10,app.activeDocument.activeLayer)
					f_counter++
				}else{
					break
				}
			}
		}
	}
}
//----------------------------------------------------
function pointTextInfo(text,font,x,y,s,l){
	vShift = (-10.043952) + (s/2) - (0.046753613 * (s / (72/25.4)))
	s=s*1.350913217
	pointTextFrame = l.textFrames.add();
	pointTextFrame.contents = text;
	pointTextFrame.top = y-vShift 
	pointTextFrame.left = x;
	pointTextFrame.textRange.characterAttributes.size = s;
	pointTextFrame.textRange.characterAttributes.textFont = font//app.textFonts.getByName('ArialMT');
	pointTextFrame.textRange.characterAttributes.fillColor = blackColour();
	pointTextFrame.textRange.paragraphAttributes.justification = Justification.CENTER;
	return pointTextFrame;
}
//-------------------------------------------------------
function blackColour(){
	blackCMYK = new CMYKColor();
	blackCMYK.cyan = 0;
	blackCMYK.magenta = 0;
	blackCMYK.yellow = 0;
	blackCMYK.black = 100;
	return blackCMYK
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
		info1 = infoGroup.add ("statictext", undefined,'Script will render all available fonts.');
		info2 = infoGroup.add ("statictext", undefined,'iusing input text, else font name.');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var inputStringGroup = mainGroup.add ('group');
		inputStringGroup.orientation = 'row'
		inputStringGroup.alignChildren = 'center'
		inputStringStatic = inputStringGroup.add ("statictext", undefined, 'String: ');
		inputStringInput = inputStringGroup.add ("edittext", ([undefined,undefined,150,21]));
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	inputStringText = inputStringInput.text
	return doSomething,inputStringText;
}
