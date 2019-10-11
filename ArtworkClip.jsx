//-------------------
userInput();
artworkClip();
//-------------------
$.writeln('\n-------------- ArtworkClip.jsx --------------\nCipping Selected Artwork To Paths...\n');
function artworkClip(){
	if(doSomething === true){
		if(app.activeDocument.selection.length > 1){
			clipArtwork(app.activeDocument.selection);
		}else{
			$.writeln('>>>Empty selection');
		}
	}
}
$.writeln('-----------------------------------------------------------------------');
//-------------------
function clipArtwork(selection){
	//-------------------
	targetArtwork = selection[(selection.length-1)];
	$.writeln(' Target artwork: ' + targetArtwork);
	//-------------------
	for(a=0;a<selection.length-1;a++){
		if(selection[a].typename === 'GroupItem' || selection[a].typename === 'TextFrame' /*|| selection[a].typename === 'CompoundPathItem'*/){
			$.writeln('>>>Skipping mask: ' + selection[a].name + ' (' + selection[a].typename + ')\n');
			continue
		}else{
			$.writeln('>>>Clipping mask: ' + selection[a].name + ' (' + selection[a].typename + ')');
			clip(targetArtwork,selection[a]);
		}
	};
	targetArtwork.remove();
}
//-------------------
function clip(artwork,mask){
	//-------------------
	clipGroup = (mask.parent).groupItems.add();
	clipGroup.name = mask.name;
	$.writeln(mask.name + ': Created mask + artwork group "' + clipGroup.name + '"');
	//-------------------
	artwork.duplicate(clipGroup, ElementPlacement.PLACEATEND);
	$.writeln(mask.name + ': Duplicated artwork to the group');
	//-------------------
	mask.move(clipGroup, ElementPlacement.PLACEATBEGINNING);
	$.writeln(mask.name + ': Moved mask to the group');
	//-------------------
	$.writeln(mask.name + ': Checking mask...');
	if(mask.typename !== 'CompoundPathItem'){
		clipGroup.clipped = true; //PROBLEM when CompoundPathItem
		$.writeln(mask.name + ': Switching clipping on in the group ' + clipGroup.name);
	}else{
		checkMask(mask);
		$.writeln(mask.name + ': Clipping individual paths finished and is on in the group ' + clipGroup.name);
	}	
	//-------------------
	clipGroup.move(clipGroup.parent, ElementPlacement.PLACEATEND);
	$.writeln('>>> Finished Clipping ' + clipGroup.name + ' (' + clipGroup.typename + ')\n');
	//-------------------
}
//-------------------
function checkMask(mask){
	//-------------------
	if(mask.typename === 'CompoundPathItem'){
		$.writeln(mask.name + ': Mask is a CompoundPathItem');
		retreiveCompoundPathItems(mask);
		mask.parent.clipped = true;
		createCompoundPath(mask.parent);
	}else{
		$.writeln(mask.name + ': Switching on item clipping');
		mask.clipping = true;
	}
	//-------------------
}
//-------------------
function createCompoundPath(group){
	//-------------------
	newMask = group.compoundPathItems.add();
	newMask.name = 'New Mask'
	newMask.filled = false;
	newMask.stroked = false;
	$.writeln(group.name + ': Created new CompoundPath');
	//-------------------
	for(c = group.pageItems.length-3; c > 0 ; c--){
		currentPath = group.pageItems[c];
		$.writeln(group.name + ': Current sub-item: ' + currentPath.typename);
		currentPath.move(newMask, ElementPlacement.PLACEATBEGINNING);
		$.writeln(group.name + ': Moved sub-item from old to new CompoundPath');
	}
	//-------------------
}
//-------------------
function retreiveCompoundPathItems(mask){
	//-------------------
	currentMainGroup = mask.parent;
	//-------------------
	for(c = mask.pathItems.length-1 ; c >= 0; c--){
		currentPath = mask.pathItems[c];
		currentPath.move(currentMainGroup, ElementPlacement.PLACEATBEGINNING);
		currentPath.filled = false;
		currentPath.stroked = false;
		currentPath.clipping = true;
		$.writeln(mask.name + ': Moved sub-item outside current CompoundPath');
	}
}
//-------------------
function checkCompoundPathMask(mask){
	//-------------------
	$.writeln(mask.name + ': Checking on individual CompoundPathItem sub-items');
	for(c = 0; c < mask.pathItems.length; c++){
		currentPath = mask.pathItems[c];
		if(currentPath.clipping === true){
			isClipping = 'is';
		}else{
			isClipping = 'was not';
		}
		$.writeln(mask.name + ': Current sub-item is ' + currentPath.name + ' (' + currentPath.typename + ') and ' + isClipping + ' clipping');
		currentPath.clipping = true;
		if(currentPath.clipping === true){
			$.writeln(mask.name + ': Current sub-item is clipping');
		}else{
			$.writeln(mask.name + ': Error with current sub-item clipping');
		}
	}
	//-------------------
}
//----------------------------------------------------
function userInput(){
	//----------------------------------------------------
	doSomething = false;
	//----------------------------------------------------
	var window = new Window ('dialog',"ArtworkClip");
	mainGroup = window.add('group');
	mainGroup.orientation = 'column'
	mainGroup.alignChildren = 'center'
	//----------------------------------------------------
	infoGroup = mainGroup.add('group');
	infoGroup.orientation = 'column'
	infoGroup.alignChildren = 'center'
		info1 = infoGroup.add ("statictext", undefined,'Script will clip lowest in hierarchy object');
		info2 = infoGroup.add ("statictext", undefined,'in selection to every path item above it.');
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