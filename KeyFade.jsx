//-------------------
$.writeln('\n-------------- KeyFade.jsx --------------\nApplying scale & opacity by black value...\n');
userInput();
keyToOpacity();
$.writeln('\n--------------      Finished       --------------');
//-------------------
function keyToOpacity(){
	if(doSomething === true){
		current_selection = app.activeDocument.selection
		if (current_selection.length > 0){
			for(i=0;i<current_selection.length;i++){
				
				current_item = current_selection[i]

				if(current_item.typename === 'PathItem'){
					
					if(current_item.fillColor.typename === 'CMYKColor'){
						fadeValue = current_item.fillColor.black
					}else if(current_item.fillColor.typename === 'GrayColor'){
						fadeValue= current_item.fillColor.gray
					}else{
						continue
					}
				
					if (opacityFade===true){
						current_item.opacity = fadeValue
					}
				
					if (scaleFade===true){
						rescaleArtwork (current_item,fadeValue,true)
					}
				
				//----------------------------				
				
				}else if(current_item.typename === 'CompoundPathItem'){
					
					current_subitem = current_item.pathItems[0]
					
					if(current_subitem.fillColor.typename === 'CMYKColor'){
						fadeValue = current_subitem.fillColor.black
					}else if(current_subitem.fillColor.typename === 'GrayColor'){
						fadeValue = current_subitem.fillColor.gray
					}else{
						continue
					}
				
					if (opacityFade===true){
						current_subitem.opacity = fadeValue
					}
				
					if (scaleFade===true){
						rescaleArtwork (current_item,fadeValue,true)
					}
				
				}else{
					continue
				}
			
				//-------------------------------------------------------------------------------- OPACITY
			}
		}
	}
}
//-------------------
function rescaleArtwork (item,scale,stroke){
	if (stroke == true){
		var strokeScale = scale;
		}else{
		var strokeScale = 0.0;
		}
	item.resize(
					scale,
					scale,
					true /*changes position - always true - required to change size*/ ,
					true /* changes pattern */ ,
					true /* changes gradient */ ,
					true /* changes stroke patterns */ , 
					strokeScale /* changes stroke width */ ,
					Transformation.CENTER
					);
}
//-------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"KeyFade");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will create fade based on ');
		info1 = infoGroup.add ("statictext", undefined,'item equivalent to their black (K) value.');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------

	var inputChecksGroup = mainGroup.add ('group');
		inputChecksGroup.orientation = 'row'
		inputChecksGroup.alignChildren = 'center'
		
		scaleCheck = inputChecksGroup.add ("checkbox", undefined, 'Scale');
		opacityCheck = inputChecksGroup.add ("checkbox", undefined, 'Opacity');

	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,150,undefined]),undefined,{borderStyle:'white'});
	
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	
	if(scaleCheck.value === true){
		scaleFade = true;
	}else{
		scaleFade = false;
	}

	if(opacityCheck.value === true){
		opacityFade = true;
	}else{
		opacityFade = false;
	}
	return doSomething,scaleFade,opacityFade;
}