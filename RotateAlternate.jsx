doSomething = false
userInput()
if(doSomething==true){
	rotateAlternate()
}
//----------------------------------------------------
function rotateAlternate(){
	if(app.activeDocument.selection.length > 0){
		item_collection = app.activeDocument.selection
		for(a=0;a<item_collection.length;a++){
			if(a % 2 == 1){
				current_item = item_collection[a]
				current_item.rotate(inputDegree,true,true,true,true,Transformation.CENTER);
			}
		}
	}
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	var w = new Window ('dialog',"RotateAlternate");
	var mainGroup = w.add ('group');
	mainGroup.orientation = 'column'
	//staticText1 = mainGroup.add ("statictext", undefined, 'Rotating alternating item from selection by 180° ');
	staticText1 = mainGroup.add ("statictext", undefined, 'Rotating alternating item from selection by degree');
	//---------------------------------------------------- 	
	divider1 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	//---------------------------------------------------- 
	var inputStringGroup = mainGroup.add ('group');
		inputStringGroup.orientation = 'row'
		inputStringGroup.alignChildren = 'center'
		inputStringStatic = inputStringGroup.add ("statictext", undefined, 'Degree: ');
		inputStringInput = inputStringGroup.add ("edittext", ([undefined,undefined,50,21]),"180");
	//---------------------------------------------------- 	
	divider2 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	//---------------------------------------------------- 
	doSomething = false;
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "Ok");
	okButton.onClick = function (){
		doSomething = true;
		w.close();
	}
	//----------------------------------------------------
	w.show();
	//----------------------------------------------------

	inputDegree = parseFloat(inputStringInput.text)
	return doSomething,inputDegree;
}