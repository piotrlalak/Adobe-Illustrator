//-------------------
$.writeln('\n-------------- PreciseRotation.jsx --------------\nRotating items to narrowest position...\n');
userInput();
preciseRotationr();
$.writeln('\n--------------      Finished       --------------');
//-------------------
function rotateItems(item,degree){
	item.rotate(
        degree /* rotation degree - negative number is clockwise*/,
        true /* changes position - always to stay true */,
        true /* changes patterns */,
        true /* changes gradients */,
        true /* changes stroke patterns */,
        Transformation.CENTER
    )
}
//-------------------
function preciseRotationr(){
	if(doSomething === true){
		current_selection = app.activeDocument.selection
		if (current_selection.length > 0){
			for(i=0;i<current_selection.length;i++){
				$.writeln('\nItem ' + (i+1) + ' of ' + current_selection.length) 
				current_item = current_selection[i]
				current_width = current_item.width

				improved_width = current_width	
				current_rotation = 0
				new_rotation = 0
			
				rotation_array = [[360,1],
									[10,0.5],
									[20,-0.5],
									[10,0.1],
									[20,-0.1],
									[10,0.05],
									[20,-0.05],
									[10,0.01],
									[20,-0.01],
									[10,0.001],
									[20,-0.001],
									]

				for(a=0;a<rotation_array.length;a++){
					$.writeln('Step ' + (a+1) + ' | ' + rotation_array[a][0] + ' | '  + rotation_array[a][1] + ' deg')
					new_rotation = rotation_sequence(current_item,rotation_array[a][0],rotation_array[a][1])
					if(improved_width < current_width){
						rotateItems(current_item,new_rotation)
					}
				}
				//-------------------

			}
		}
	}
}
//-------------------
function rotation_sequence(item,rotation_range,degree){
	
	current_width = item.width
	improved_width = current_width	
	new_rotation = 0
	
	if(degree<0.05){
		r_increments = 0.05
	}else{
		r_increments = degree
	}

	//r_increments = 5
	n_rotations = parseInt(rotation_range  / r_increments)//360

	for(r=0;r<n_rotations;r=r+r_increments){
		duplicated_item = item.duplicate(app.activeDocument.activeLayer, ElementPlacement.PLACEATEND);
		rotateItems(duplicated_item,r)
		new_width = duplicated_item.width
		if(new_width < improved_width){
			new_rotation = r
			improved_width = new_width
		}
		duplicated_item.remove()
	}
	return new_rotation
}
//-------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"PreciseRotation");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will precisely rotate selected');
		info1 = infoGroup.add ("statictext", undefined,'items to their narrowest width.');
		info3 = infoGroup.add ("statictext", undefined,'Press OK to continue');
	//----------------------------------------------------
	divider1 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	//----------------------------------------------------
	/*
	var inputStringGroup = mainGroup.add ('group');
		inputStringGroup.orientation = 'row'
		inputStringGroup.alignChildren = 'center'
		inputStringStatic = inputStringGroup.add ("statictext", undefined, 'Totation increment: ');
		inputStringInput = inputStringGroup.add ("edittext", ([undefined,undefined,50,21]),0.1);
	//----------------------------------------------------
	divider2 = mainGroup.add('panel',([undefined,undefined,175,undefined]),undefined,{borderStyle:'white'});
	*/
	//----------------------------------------------------
	var okButton = mainGroup.add ("button", undefined, "OK");
	okButton.onClick = function (){
		doSomething = true;
		window.close();
	}
	//----------------------------------------------------
	window.show();
	//----------------------------------------------------
	//inputIncrement = (parseFloat(inputStringInput.text))
	return doSomething;//,inputIncrement;
}