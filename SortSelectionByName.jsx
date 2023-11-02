userInput()
if(doSomething === true){
	if(app.activeDocument.selection.length > 1){
		sortselectionbyname()
	}
}
//----------------------------------------------------------------------------

function sortselectionbyname(){
	current_selection = app.activeDocument.selection
	
	temp_group = current_selection[0].parent.groupItems.add();
	temp_group.name = 'Temp Selection Group'
	
	temp_group_sorted = current_selection[0].parent.groupItems.add();
	temp_group_sorted.name = 'Temp Selection Group - Sorted'
	
	for(i=0;i<app.activeDocument.selection.length;i++){
		app.activeDocument.selection[i].move(temp_group, ElementPlacement.PLACEATEND)
	}
	
	current_selection_list = get_selection_array(temp_group.pageItems)
	current_selection_list = sort_array_by_name(current_selection_list)
	
	for(i=0;i<current_selection_list.length;i++){
		current_index = current_selection_list[i].index
		temp_group_item = current_selection[current_index]
		temp_group_item.move(temp_group_sorted, ElementPlacement.PLACEATBEGINNING);
	}
	
	new_loc = temp_group_sorted.parent
	
	temp_counter = temp_group_sorted.pageItems.length
	
	for(i=temp_counter-1;i>=0;i--){
		temp_group_item = temp_group_sorted.pageItems[i]
		$.writeln(temp_group_item)
		temp_group_item.move(new_loc, ElementPlacement.PLACEATBEGINNING);
	}
}

//----------------------------------------------------------------------------

function get_selection_array(selection){
	selection_list = []
	for(i=0;i<selection.length;i++){
		selection_list[i] = {name : selection[i].name,index : [i]}
	}
	return selection_list
}

//----------------------------------------------------------------------------

function sort_array_by_name(array){
	array = array.sort(function(a, b) {
	nameA = a.name
	nameB = b.name
	if (nameA > nameB) {
		return -1;
	}
	if (nameA < nameB) {
		return 1;
	}
	return 0;
	})
	return array
}

//----------------------------------------------------------------------------

function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"SortSelectionByName");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will sort selected page items by name alphabetically');
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